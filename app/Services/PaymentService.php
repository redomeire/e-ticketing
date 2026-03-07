<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;

class PaymentService
{
    protected InvoiceApi $invoiceApi;
    public function __construct(InvoiceApi $invoiceApi)
    {
        $this->invoiceApi = $invoiceApi;
    }

    public function createInvoice(Order $order, User $user)
    {
        try {
            $items = $order->orderItem->map(function (OrderItem $item) {
                return [
                    'name' => "Seat " . ($item->seat->seat_number ?? 'N/A') . ' - ' . ($item->seat->category->name ?? 'N/A'),
                    'quantity' => 1,
                    'price' => $item->price_at_purchase,
                ];
            })->toArray();

            $params = [
                'external_id' => $order->invoice_id,
                'amount' => $order->total_amount,
                'description' => "Order #" . $order->invoice_id,
                'customer' => [
                    'given_names' => $user->name,
                    'email' => $user->email,
                ],
                'items' => $items,
                'currency' => 'IDR',
                'invoice_duration' => 5 * 60,
                'success_redirect_url' => '' . config('app.additional_config_files.frontend_url') . '/payment/checkout/success',
                'failure_redirect_url' => '' . config('app.additional_config_files.frontend_url') . '/payment/checkout/failure?orderId=' . $order->id,
            ];
            $invoice_request = new CreateInvoiceRequest($params);
            $invoice_payload = $this->invoiceApi->createInvoice($invoice_request);
            return $invoice_payload;
        } catch (\Exception $e) {
            throw new \Exception('Failed to create invoice: ' . $e->getMessage());
        }
    }
}