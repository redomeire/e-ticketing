<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $firstItem = $this->orderItem->first();
        $ticketCategory = $firstItem->seat->ticketCategory ?? null;
        $event = $ticketCategory->event ?? null;

        $base_price_amount = $this->orderItem->sum(function ($item) {
            return $item->seat->ticketCategory->base_price ?? 0;
        });
        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'base_amount' => $base_price_amount,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),

            'event_name' => $event?->name,
            'start_time' => $event?->start_time,
            'end_time' => $event?->end_time,
            'location' => $event?->location,

            'attendees' => $this->attendee->map(function ($person) use ($ticketCategory) {
                return [
                    'id' => $person->id,
                    'name' => $person->name,
                    'email' => $person->email,
                    'phone' => $person->phone,
                    'is_male' => (bool) $person->is_male,
                    'seat_number' => $person->seat->seat_number ?? null,
                    'category' => $ticketCategory->name ?? null,
                ];
            }),
        ];
    }
}
