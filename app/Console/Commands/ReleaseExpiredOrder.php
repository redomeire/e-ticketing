<?php

namespace App\Console\Commands;

use App\Models\EventSeat;
use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

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
        $expiry_threshold = now()->subMinutes(5);

        $expired_orders = Order::where('status', 'pending')
            ->where('created_at', '<', $expiry_threshold)
            ->whereNotNull('payment_url')
            ->with('orderItem:id,order_id,seat_id')
            ->get();

        if ($expired_orders->isEmpty()) {
            return;
        }

        $order_ids = $expired_orders->pluck('id');
        $seat_ids = $expired_orders->flatMap(function ($order) {
            return $order->orderItem->pluck('seat_id');
        })->unique();

        DB::transaction(function () use ($order_ids, $seat_ids) {
            Order::whereIn('id', $order_ids)->update([
                'payment_url' => null,
                'status' => 'expired',
                'updated_at' => now()
            ]);

            if ($seat_ids->isNotEmpty()) {
                EventSeat::whereIn('id', $seat_ids)->update([
                    'is_available' => true,
                    'locked_until' => null,
                    'updated_at' => now()
                ]);
            }
        });
        $this->info(count($order_ids) . ' Expired seats released successfully.');
    }
}
