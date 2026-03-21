<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\EventSeat;
use Illuminate\Http\Request;
use App\Services\PaymentService;
use App\Jobs\RetrieveCheckoutJob;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\OrderDetailResource;

class OrderController extends Controller
{
    protected PaymentService $payment_service;
    public function __construct(PaymentService $payment_service)
    {
        $this->payment_service = $payment_service;
    }
    public function all(Request $request)
    {
        try {
            $user = auth()->user();
            $page = $request->query('page', 1);
            $signature = md5(serialize([
                'user_id' => $user->id,
                'page' => $page,
            ]));
            $cache_key = "orders:{$user->id}:{$signature}";
            $cached_data = Cache::tags(["orders_{$user->id}"])->get($cache_key);
            if ($cached_data) {
                return $this->sendResponse($cached_data, 'Orders retrieved successfully (from cache)');
            }
            $orders = DB::table('orders')
                ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                ->select(
                    'orders.id',
                    'orders.invoice_id',
                    'orders.status',
                    'orders.payment_url',
                    'orders.created_at',
                    'orders.event_name',
                    'orders.event_start_time',
                    'orders.event_location',
                    'orders.total_amount',
                )
                ->selectRaw('COUNT(order_items.id) as total_tickets')
                ->where('orders.user_id', $user->id)
                ->whereNot('orders.status', 'expired')
                ->groupBy(
                    'orders.id',
                    'orders.invoice_id',
                    'orders.status',
                    'orders.payment_url',
                    'orders.created_at',
                    'orders.event_name',
                    'orders.event_start_time',
                    'orders.event_location'
                )
                ->orderBy('orders.created_at', 'desc')
                ->paginate(10, ['*'], 'page', $page);

            Cache::tags(["orders_{$user->id}"])->put($cache_key, $orders, now()->addMinutes(10));
            return $this->sendResponse($orders, 'Orders retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve orders', [
                $e->getMessage()
            ], 500);
        }
    }
    public function show($id)
    {
        try {
            $user = auth()->user();

            $order = Order::where('id', $id)
                ->where('user_id', $user->id)
                ->with([
                    'orderItem:id,order_id,seat_id,price_at_purchase,base_price,ticket_category_name,seat_number',
                    'attendee:id,order_id,seat_id,name,email,phone,is_male',
                ])
                ->select(
                    'id',
                    'invoice_id',
                    'status',
                    'total_amount',
                    'created_at',
                    'event_name',
                    'event_location as location',
                    'event_start_time as start_time'
                )
                ->first();

            if (!$order) {
                return $this->sendError('Order not found', [], 404);
            }

            $orderData = $order->toArray();
            $orderData['total_amount'] = $order->orderItem->sum('price_at_purchase');
            $orderData['base_amount'] = $order->orderItem->sum('base_price');
            $orderData['attendees'] = $order->attendee->map(function ($person) use ($order) {
                $item = $order->orderItem->where('seat_id', $person->seat_id)->first();

                return [
                    'id' => $person->id,
                    'name' => $person->name,
                    'email' => $person->email,
                    'phone' => $person->phone,
                    'is_male' => (bool) $person->is_male,
                    'seat_number' => $item->seat_number ?? null,
                    'category' => $item->ticket_category_name ?? null,
                ];
            });
            unset($orderData['order_item']);
            unset($orderData['attendee']);

            return $this->sendResponse($orderData, 'Order details retrieved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve order details', [
                $e->getMessage()
            ], 500);
        }
    }
    public function checkout(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'attendees' => 'required|array|min:1',
                'attendees.*.name' => 'required|string|max:255',
                'attendees.*.email' => 'required|email|max:255',
                'attendees.*.phone' => 'required|string|max:20',
                'attendees.*.is_male' => 'required|boolean',
                'attendees.*.seat_id' => 'required|exists:event_seats,id',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }

            $validated = $validator->validated();
            $user = auth()->user();
            $seat_ids = collect($validated['attendees'])->pluck('seat_id')->toArray();

            $response = DB::transaction(function () use ($validated, $user, $seat_ids) {
                $seats = EventSeat::whereIn('id', $seat_ids)
                    ->where(function ($query) {
                        $query->whereNull('locked_until')
                            ->orWhere('locked_until', '<', now());
                    })
                    ->lockForUpdate()
                    ->get();
                if ($seats->count() !== count(array_unique($seat_ids))) {
                    throw new \Exception('One or more selected seats are no longer available. Please choose different seats.');
                }
                EventSeat::whereIn('id', $seat_ids)->update([
                    'is_available' => false,
                    'locked_until' => now()->addMinutes(5),
                ]);

                // fees
                $subtotal = $seats->sum(function ($seat) {
                    return $seat->ticketCategory->base_price;
                });
                $application_fee = $subtotal * 0.1;
                $total_amount = $subtotal + $application_fee;

                $event = $seats->first()->ticketCategory->event;
                $order = Order::create([
                    'user_id' => $user->id,
                    'invoice_id' => uniqid('INV-'),
                    'status' => 'pending',
                    'total_amount' => $total_amount,
                    'event_name' => $event->name,
                    'event_start_time' => $event->start_time,
                    'event_end_time' => $event->end_time,
                    'event_location' => $event->location
                ]);
                $order_items = [];
                $attendees_data = [];
                $now = now();

                foreach ($validated['attendees'] as $attendee) {
                    $current_seat = $seats->firstWhere('id', $attendee['seat_id']);
                    $ticket_category = $current_seat->ticketCategory;

                    $order_items[] = [
                        'order_id' => $order->id,
                        'seat_id' => $attendee['seat_id'],
                        'price_at_purchase' => $ticket_category->base_price * 1.1,
                        'created_at' => $now,
                        'updated_at' => $now,
                        'ticket_category_name' => $ticket_category->name,
                        'seat_number' => $current_seat->seat_number,
                        'base_price' => $ticket_category->base_price,
                    ];

                    $attendees_data[] = array_merge($attendee, [
                        'order_id' => $order->id,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }

                DB::table('order_items')->insert($order_items);
                DB::table('attendees')->insert($attendees_data);

                $invoice_url = $this->createInvoice($order);
                $order->update(['payment_url' => $invoice_url]);
                return [
                    'order_id' => $order->id,
                    'invoice_url' => $invoice_url,
                ];
            });

            return $this->sendResponse($response, 'Checkout URL created', 201);
        } catch (\Exception $e) {
            return $this->sendError('Checkout failed', [
                $e->getMessage()
            ], 500);
        }
    }
    public function repay($id)
    {
        try {
            $user = auth()->user();
            $order = Order::where('id', $id)->where('user_id', $user->id)->firstOrFail();
            if ($order->status !== 'pending') {
                return $this->sendError('Only pending orders can be repaid', [], 400);
            }
            $invoice_url = $this->createInvoice($order);
            $order->update(['payment_url' => $invoice_url]);
            return $this->sendResponse(['invoice_url' => $invoice_url], 'New Payment URL created');
        } catch (\Exception $e) {
            return $this->sendError('Repayment failed', [
                $e->getMessage()
            ], 500);
        }
    }
    public function checkoutWebhook(Request $request)
    {
        try {
            $payload = $request->all();
            Log::info('Received webhook payload', $payload);
            RetrieveCheckoutJob::dispatch($payload);
            return $this->sendResponse(null, 'Webhook received and processing started');
        } catch (\Exception $e) {
            return $this->sendError('Failed to process webhook', [
                $e->getMessage()
            ], 500);
        }
    }
    private function createInvoice(Order $order)
    {
        $order->load('orderItem.seat');
        $invoice = $this->payment_service->createInvoice($order, auth()->user());
        return $invoice->getInvoiceUrl();
    }
}
