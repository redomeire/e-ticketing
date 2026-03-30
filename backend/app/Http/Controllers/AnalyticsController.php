<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventSeat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
class AnalyticsController extends Controller
{
    public function getAnalytics(Request $request)
    {
        try {
            $cached_data = Cache::tags(["analytics"])->get('analytics_data');
            if ($cached_data) {
                return $this->sendResponse($cached_data, 'Analytics data fetched successfully from cache.');
            }
            $totalSeatsBooked = EventSeat::where('is_available', false)->count();
            $total_users = User::whereNot([
                ['role', 'admin'],
                ['role', 'superadmin']
            ])->count();
            $total_events = Event::count();
            $data = [
                'total_seats_booked' => $totalSeatsBooked,
                'total_users' => $total_users,
                'total_events' => $total_events
            ];
            Cache::tags(["analytics"])->put('analytics_data', $data, now()->addMinutes(20));

            return $this->sendResponse($data, 'Analytics data fetched successfully.');
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching analytics data.'], 500);
        }
    }
}
