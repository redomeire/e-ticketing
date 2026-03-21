<?php

namespace App\Jobs;

use App\Mail\PaymentFailed;
use App\Mail\PaymentSuccess;
use App\Models\EventSeat;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
            $status = $this->payload['status'] ?? null;
            $invoice_id = $this->payload['external_id'] ?? null;

            if (!$status || !$invoice_id) {
                Log::error('Payload webhook invalid.', $this->payload);
                return;
            }
            $order = Order::where('invoice_id', $invoice_id)->first();
            if (!$order || $order->status === 'paid') {
                Log::warning("Order not found or already paid: {$invoice_id}");
                return;
            }
            $status_upper = strtoupper($status);
            DB::transaction(function () use ($order, $status_upper, $invoice_id) {
                Payment::create([
                    'order_id' => $order->id,
                    'external_id' => $invoice_id,
                    'payment_method' => $this->payload['payment_method'] ?? 'unknown',
                    'payment_channel' => $this->payload['payment_channel'] ?? 'unknown',
                    'amount' => $this->payload['amount'] ?? 0,
                    'status' => strtolower($status_upper),
                    'paid_at' => now(),
                ]);

                $order->update([
                    'status' => strtolower($status_upper),
                    'payment_url' => null
                ]);

                if ($status_upper === 'PAID') {
                    $this->update_seats_status($order->id, false, null);
                    Mail::to($order->user->email)->send(new PaymentSuccess($order));
                    Log::info("Order #{$order->invoice_id} marked as PAID.");
                } else if (in_array($status_upper, ['EXPIRED', 'FAILED'])) {
                    $this->update_seats_status($order->id, true, null);

                    $order->attendees()->delete();

                    if ($status_upper === 'FAILED') {
                        Mail::to($order->user->email)->send(new PaymentFailed($order));
                    }
                    Log::warning("Order #{$order->invoice_id} released due to {$status_upper}.");
                }
            });
            Cache::tags(["orders_{$order->user_id}"])->flush();

        } catch (\Throwable $th) {
            Log::error('Error processing Xendit webhook: ' . $th->getMessage());
            throw $th;
        }
    }
    private function update_seats_status(int $order_id, bool $is_available, $locked_until): void
    {
        EventSeat::whereHas('orderItem', function ($query) use ($order_id) {
            $query->where('order_id', $order_id);
        })->update([
                    'is_available' => $is_available,
                    'locked_until' => $locked_until,
                    'updated_at' => now()
                ]);
    }
}
