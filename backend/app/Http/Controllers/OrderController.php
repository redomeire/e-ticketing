<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderDetailResource;
use App\Jobs\RetrieveCheckoutJob;
use App\Models\EventSeat;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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
            $orders = DB::table('orders')
                ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                ->join('event_seats', 'order_items.seat_id', '=', 'event_seats.id')
                ->join('event_ticket_categories', 'event_seats.ticket_category_id', '=', 'event_ticket_categories.id')
                ->join('events', 'event_ticket_categories.event_id', '=', 'events.id')
                ->select(
                    'orders.id',
                    'orders.invoice_id',
                    'orders.status',
                    'orders.payment_url',
                    'orders.created_at',
                )
                ->selectRaw('SUM(order_items.price_at_purchase) as total_amount')
                ->selectRaw('MIN(events.name) as event_name')
                ->selectRaw('MIN(events.start_time) as start_time')
                ->selectRaw('MIN(events.end_time) as end_time')
                ->selectRaw('COUNT(order_items.id) as total_tickets')
                ->where('orders.user_id', $user->id)
                ->whereNot('orders.status', 'expired')
                ->groupBy(
                    'orders.id',
                    'orders.invoice_id',
                    'orders.status',
                    'orders.payment_url',
                    'orders.created_at',
                )
                ->orderBy('orders.created_at', 'desc')
                ->paginate(10, ['*'], 'page', $page);

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
                    'orderItem:id,order_id,seat_id,price_at_purchase',
                    'orderItem.seat:id,ticket_category_id,seat_number',
                    'orderItem.seat.ticketCategory:id,event_id,name,base_price',
                    'orderItem.seat.ticketCategory.event:id,name,start_time,end_time,location',
                    'attendee:id,order_id,seat_id,name,email,phone,is_male',
                    'attendee.seat:id,seat_number',
                    'attendee.seat.ticketCategory:id,name'
                ])
                ->select('id', 'invoice_id', 'status', 'total_amount', 'created_at')
                ->first();
            if (!$order) {
                return $this->sendError('Order not found', [], 404);
            }
            return (new OrderDetailResource($order))->additional([
                'success' => true,
                'message' => 'Order details retrieved successfully'
            ]);
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

                $order = Order::create([
                    'user_id' => $user->id,
                    'invoice_id' => uniqid('INV-'),
                    'status' => 'pending',
                    'total_amount' => $total_amount,
                ]);
                $order_items = [];
                $attendees_data = [];
                $now = now();

                foreach ($validated['attendees'] as $attendee) {
                    $current_seat = $seats->firstWhere('id', $attendee['seat_id']);

                    $order_items[] = [
                        'order_id' => $order->id,
                        'seat_id' => $attendee['seat_id'],
                        'price_at_purchase' => $current_seat->ticketCategory->base_price * 1.1,
                        'created_at' => $now,
                        'updated_at' => $now,
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
