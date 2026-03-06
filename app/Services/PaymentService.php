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

    public function createInvoice(Order $order, OrderItem $order_item, User $user)
    {
        try {
            $params = [
                'external_id' => $order->invoice_id,
                'amount' => $order_item->price_at_purchase,
                'description' => "Order #" . $order->invoice_id,
                'customer' => [
                    'given_names' => $user->name,
                    'email' => $user->email,
                ],
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