export interface Seat {
    id: number;
    seat_number: string;
    is_available: boolean;
    price: number;
}

export interface AttendeeFormData {
    name: string;
    email: string;
    phone: string;
    seat_id: number;
}

export type AttendeeState = Record<number, AttendeeFormData>;