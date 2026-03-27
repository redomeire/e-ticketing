<?php

namespace App\Console\Commands;

use App\Models\Attendee;
use App\Models\EventSeat;
use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ReleaseExpiredOrder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:release-expired-order';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Release expired order regularly';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = now()->subMinutes(5);

        try {
            DB::transaction(function () use ($threshold) {
                $expired_orders = Order::where('status', 'pending')
                    ->where('created_at', '<', $threshold)
                    ->with('orderItem')
                    ->get();

                if ($expired_orders->isNotEmpty()) {
                    $order_ids = $expired_orders->pluck('id');
                    $seat_ids = $expired_orders->flatMap(fn($order) => $order->orderItem->pluck('seat_id'))->unique();

                    Order::whereIn('id', $order_ids)->update(['status' => 'expired', 'payment_url' => null]);
                    Attendee::whereIn('order_id', $order_ids)->delete();
                    if ($seat_ids->isNotEmpty()) {
                        EventSeat::whereIn('id', $seat_ids)->update(['is_available' => true, 'locked_until' => null]);
                    }
                    $this->info("Cleared " . $order_ids->count() . " expired pending orders.");
                }

                $zombie_seats = EventSeat::where('is_available', false)
                    ->where('locked_until', '<=', now())
                    ->whereDoesntHave('orderItem.order', function ($query) {
                        $query->where('status', 'paid');
                    })
                    ->get();

                if ($zombie_seats->isNotEmpty()) {
                    $zombie_seat_ids = $zombie_seats->pluck('id');

                    Attendee::whereIn('seat_id', $zombie_seat_ids)
                        ->whereNull('deleted_at')
                        ->delete();

                    EventSeat::whereIn('id', $zombie_seat_ids)->update([
                        'is_available' => true,
                        'locked_until' => null,
                        'updated_at' => now()
                    ]);

                    $this->warn("Released " . $zombie_seat_ids->count() . " orphan/failed locks and cleared ghost attendees.");
                }
            });
            Cache::tags(["orders"])->flush();

            $this->info('Cleanup successful.');
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        }
    }
}
