<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\Attendee;
use App\Models\EventSeat;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReleaseExpiredOrderJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected Order $order;
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $order = $this->order;
            if (!$order) {
                Log::warning("Order not found: {$order->id}");
                return;
            }
            if ($order->status !== 'pending') {
                Log::info("Order status is not pending, skipping: {$order->id}");
                return;
            }
            DB::transaction(function () use ($order) {
                $order->update(['status' => 'expired', 'payment_url' => null]);
                Attendee::where('order_id', $order->id)->delete();
                $seat_ids = $order->orderItem->pluck('seat_id')->unique();
                if ($seat_ids->isNotEmpty()) {
                    EventSeat::whereIn('id', $seat_ids)->update(['is_available' => true, 'locked_until' => null]);
                }
                Log::info("Cleared expired pending order: {$order->id}");
            });
            Cache::tags(["orders"])->flush();
        } catch (\Throwable $th) {
            Log::error('Error processing ReleaseExpiredOrderJob: ' . $th->getMessage());
            throw $th;
        }
    }
}
