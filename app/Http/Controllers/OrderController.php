<?php

namespace App\Http\Controllers;

use App\Jobs\RetrieveCheckoutJob;
use App\Models\EventSeat;
use App\Models\Order;
use App\Models\OrderItem;
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
    public function checkout(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'seat_id' => 'required|exists:event_seats,id',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            $user = auth()->user();
            DB::beginTransaction();
            // create order
            $seat = EventSeat::where('id', $validated['seat_id'])
                ->lockForUpdate()
                ->first();
            $is_locked = $seat->locked_until && $seat->locked_until > now();
            if ($is_locked && !$seat->is_available) {
                throw new \Exception('Sorry, this seat is currently taken. Please choose another one.');
            }
            $seat->update([
                'is_available' => false,
                'locked_until' => now()->addMinutes(5),
            ]);
            $price = $seat->price;
            $application_fee = $price * 0.1;
            $order = Order::create([
                'user_id' => $user->id,
                'invoice_id' => uniqid('INV-'),
            ]);
            $order_item = OrderItem::create([
                'order_id' => $order->id,
                'seat_id' => $validated['seat_id'],
                'price_at_purchase' => $price + $application_fee,
            ]);
            DB::commit();
            $invoice_url = $this->createInvoice($order, $order_item);
            return $this->sendResponse([
                'invoice_url' => $invoice_url,
            ], 'Checkout url created', 201);
        } catch (\Exception $e) {
            return $this->sendError('Checkout failed', [
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
            return response()->json(['message' => 'Webhook handled successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Webhook handling failed', 'error' => $e->getMessage()], 500);
        }
    }
    private function createInvoice(Order $order, OrderItem $order_item)
    {
        $invoice = $this->payment_service->createInvoice($order, $order_item, auth()->user());
        return $invoice->getInvoiceUrl();
    }
}
