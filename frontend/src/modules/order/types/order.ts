export interface IOrderHistory {
    id: number;
    invoice_id: string;
    status: 'pending' | 'paid' | 'expired' | 'failed';
    payment_url: string;
    created_at: string;
    total_amount: number;
    event_name: string;
    event_start_time: string;
    event_location: string;
    total_tickets: number;
}