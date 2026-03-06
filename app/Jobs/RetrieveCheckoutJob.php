<?php

namespace App\Jobs;

use App\Mail\PaymentFailed;
use App\Mail\PaymentSuccess;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RetrieveCheckoutJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected array $payload;
    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Payment webhook triggered. Payload:', $this->payload);

            $status = $this->payload['status'] ?? null;
            $invoiceId = $this->payload['external_id'] ?? null;

            if (!$status || !$invoiceId) {
                Log::error('Payload webhook invalid. Missing id or status', $this->payload);
                return;
            }

            $order = Order::where('invoice_id', $invoiceId)->first();

            if (!$order) {
                Log::warning("Invoice with ID '{$invoiceId}' not found.");
                return;
            }

            if ($order->status === 'paid') {
                Log::warning("Invoice with ID #{$order->invoice_id} already has 'paid' status, reject webhook.");
                return;
            }

            if ($status === 'PAID') {
                Payment::create([
                    'order_id' => $order->id,
                    'external_id' => $invoiceId,
                    'payment_method' => $this->payload['payment_method'] ?? 'unknown',
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
                $order->status = 'paid';
                $order->save();
                Log::info("Invoice with ID #{$order->invoice_id} successfully changed to 'paid'.");
                $user = User::find($order->user_id);
                Mail::to($user->email)->send(new PaymentSuccess(order: $order));
                Log::info("Payment success email sent to user with email {$user->email} for order #{$order->invoice_id}.");
            } elseif ($status === 'EXPIRED') {
                Log::warning(message: "Invoice #{$order->invoice_id} has been expired.");
                $order->status = 'expired';
                $order->save();
                // create payment
                Payment::create([
                    'order_id' => $order->id,
                    'external_id' => $invoiceId,
                    'payment_method' => $this->payload['payment_method'] ?? 'unknown',
                    'status' => 'expired',
                    'paid_at' => now(),
                ]);
            } elseif ($status === 'FAILED') {
                Log::warning("Invoice with ID #{$order->invoice_id} gagal.");
                $order->status = 'failed';
                $order->save();

                // create payment
                Payment::create([
                    'order_id' => $order->id,
                    'external_id' => $invoiceId,
                    'payment_method' => $this->payload['payment_method'] ?? 'unknown',
                    'status' => 'failed',
                    'paid_at' => now(),
                ]);

                if ($order->user_id) {
                    $user = User::find($order->user_id);
                    Mail::to($user->email)->send(new PaymentFailed($order));
                    Log::info("Payment failed email sent to user with email {$user->email} for order #{$order->invoice_id}.");
                }
            }
        } catch (\Throwable $th) {
            Log::error('Error processing Xendit webhook: ' . $th->getMessage(), $this->payload);
            throw $th;
        }
    }
}
