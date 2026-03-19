<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventSeat;
use App\Models\EventTicketCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $event = Event::create([
            'name' => 'Tech Conference 2024',
            'slug' => 'tech-conference-2024',
            'description' => 'An annual conference showcasing the latest in technology and innovation.',
            'terms_and_conditions' => 'All attendees must adhere to the code of conduct.',
            'cover_image_url' => 'https://images.stockcake.com/public/e/b/f/ebf4b9db-e209-448c-83e0-5cadc279e975_large/global-business-conference-stockcake.jpg',
            'start_time' => now()->addDays(30),
            'end_time' => now()->addDays(32),
            'location' => 'San Francisco, CA',
            'max_row' => 5,
            'max_column' => 5,
            'is_active' => true,
        ]);
        $event->categories()->create([
            'name' => 'Technology',
        ]);
        EventTicketCategory::create([
            'event_id' => $event->id,
            'name' => 'Regular',
            'base_price' => 50000,
            'quota' => 30,
        ]);
        EventSeat::create([
            'ticket_category_id' => 1,
            'seat_number' => 'A1',
            'is_available' => true,
            'row_index' => 0,
            'column_index' => 0,
        ]);
    }
}
