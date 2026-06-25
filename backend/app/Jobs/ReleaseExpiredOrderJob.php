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
    protected $user_id;
    public function __construct(Order $order, $user_id = null)
    {
        $this->order = $order;
        $this->user_id = $user_id;
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
                    $event_seats = EventSeat::whereIn('id', $seat_ids)
                        ->with([
                            'ticketCategory' => function ($query) {
                                $query->select('id', 'name', 'base_price', 'event_id');
                            },
                            'ticketCategory.event' => function ($query) {
                                $query->select('id', 'name', 'start_time', 'end_time', 'location');
                            }
                        ]);
                    $event_id = $event_seats->first()->ticketCategory->event->id ?? null;
                    if ($event_id) {
                        $signature = md5(serialize([
                            'event_id' => $event_id,
                            'user_id' => $this->user_id,
                        ]));
                        $cache_key = "event:seats:{$signature}";

                        Cache::tags(["event_seats"])->forget($cache_key);
                    }
                    $event_seats->update(['is_available' => true, 'locked_until' => null]);
                }
                Log::info("Cleared expired pending order: {$order->id}");
            });
        } catch (\Throwable $th) {
            Log::error('Error processing ReleaseExpiredOrderJob: ' . $th->getMessage());
            throw $th;
        }
    }
}
