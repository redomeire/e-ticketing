interface IEvent {
    id: number;
    name: string;
    slug: string;
    description?: string;
    terms_and_conditions?: string;
    cover_image_url?: string;
    start_time: string;
    end_time: string;
    location: string;
    max_row: number;
    max_column: number;
    is_active: boolean;
}

interface IEventTicketCategory {
    id: number;
    event_id: number;
    name: string;
    base_price: number;
    quota: number;
}

interface IEventSeat {
    id: number;
    ticket_category_id: number;
    seat_number: string;
    row_index: number;
    column_index: number;
    is_available: boolean;
    locked_until: string | null;
}

interface IEventCategory {
    id: number;
    name: string;
    base_price: number;
    quota: number;
}

interface IAttendee {
    id: number;
    name: string;
    email: string;
    is_male: boolean;
    phone: string;
    seat_id: number;
    order_id: number;
}

export type {
    IEvent,
    IEventTicketCategory,
    IEventSeat,
    IEventCategory,
    IAttendee
};