<?php

namespace App\Services;

use App\Enums\PaymentGateway;
use App\Enums\PaymentStatus;
use App\Exceptions\ApiException;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use App\Payments\Contracts\PaymentGatewayInterface;
use App\Payments\Gateways\BkashGateway;
use App\Payments\Gateways\SslCommerzGateway;
use App\Payments\Gateways\StripeGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{
    public function initiate(User $user, array $data): Payment
    {
        $order = Order::query()->with(['items', 'user'])->findOrFail($data['order_id']);

        if (! $user->isStaff() && $order->user_id !== $user->id) {
            throw new ApiException('You are not allowed to pay this order.', 403);
        }

        if ($order->payment_status === 'paid') {
            throw new ApiException('Order is already paid.', 422);
        }

        $payment = DB::transaction(function () use ($order, $user, $data): Payment {
            $payment = Payment::query()->create([
                'order_id' => $order->id,
                'user_id' => $order->user_id,
                'gateway' => $data['gateway'],
                'status' => PaymentStatus::INITIATED,
                'transaction_id' => $this->transactionId($data['gateway']),
                'amount' => $order->total,
                'currency' => strtoupper($data['currency'] ?? config('payments.currency')),
                'metadata' => [
                    'requested_by' => $user->id,
                    'client' => $data['metadata'] ?? [],
                ],
            ]);

            $order->update(['payment_status' => 'unpaid']);

            return $payment->load(['order.user', 'user']);
        });

        $payment = $this->gateway($payment->gateway)->initiate($payment, $data);

        Log::info('Payment initiated', [
            'payment_id' => $payment->id,
            'order_id' => $payment->order_id,
            'gateway' => $payment->gateway,
        ]);

        return $payment->load('order.items');
    }

    public function show(User $user, Payment $payment): Payment
    {
        if (! $user->isStaff() && $payment->user_id !== $user->id) {
            throw new ApiException('Payment not found.', 404);
        }

        return $payment->load('order.items');
    }

    public function handleGatewayWebhook(string $gateway, array $payload, array $headers = []): ?Payment
    {
        $payment = $this->gateway($gateway)->handleWebhook($payload, $headers);

        if (! $payment) {
            Log::warning('Payment webhook did not match a payment', ['gateway' => $gateway, 'payload' => $payload]);

            return null;
        }

        $this->syncOrderPaymentStatus($payment);

        Log::info('Payment webhook processed', [
            'payment_id' => $payment->id,
            'order_id' => $payment->order_id,
            'gateway' => $gateway,
            'status' => $payment->status,
        ]);

        return $payment->load('order.items');
    }

    public function mark(Payment $payment, string $status, array $payload = []): Payment
    {
        $payment->update([
            'status' => $status,
            'raw_response' => $payload ?: $payment->raw_response,
            'paid_at' => $status === PaymentStatus::SUCCEEDED ? now() : $payment->paid_at,
        ]);

        $this->syncOrderPaymentStatus($payment->refresh());

        return $payment->load('order.items');
    }

    private function syncOrderPaymentStatus(Payment $payment): void
    {
        $orderStatus = match ($payment->status) {
            PaymentStatus::SUCCEEDED => 'paid',
            PaymentStatus::FAILED => 'failed',
            PaymentStatus::REFUNDED => 'refunded',
            default => 'unpaid',
        };

        $payment->order()->update(['payment_status' => $orderStatus]);
    }

    private function gateway(string $gateway): PaymentGatewayInterface
    {
        return match ($gateway) {
            PaymentGateway::STRIPE => app(StripeGateway::class),
            PaymentGateway::SSLCOMMERZ => app(SslCommerzGateway::class),
            PaymentGateway::BKASH => app(BkashGateway::class),
            default => throw new ApiException('Unsupported payment gateway.', 422),
        };
    }

    private function transactionId(string $gateway): string
    {
        return strtoupper($gateway).'-'.now()->format('YmdHis').'-'.Str::upper(Str::random(8));
    }
}
