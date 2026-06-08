<?php

namespace App\Payments\Gateways;

use App\Enums\PaymentStatus;
use App\Exceptions\ApiException;
use App\Models\Payment;
use App\Payments\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StripeGateway implements PaymentGatewayInterface
{
    public function initiate(Payment $payment, array $options = []): Payment
    {
        $secret = config('payments.stripe.secret_key');

        if (! $secret) {
            throw new ApiException('Stripe is not configured.', 500);
        }

        $successUrl = $options['success_url'] ?? config('payments.frontend_success_url');
        $cancelUrl = $options['cancel_url'] ?? config('payments.frontend_cancel_url');

        $response = Http::asForm()
            ->withToken($secret)
            ->post('https://api.stripe.com/v1/checkout/sessions', [
                'mode' => 'payment',
                'success_url' => $successUrl.'?payment_id='.$payment->id.'&status=success',
                'cancel_url' => $cancelUrl.'?payment_id='.$payment->id.'&status=cancelled',
                'client_reference_id' => $payment->transaction_id,
                'payment_intent_data[metadata][payment_id]' => (string) $payment->id,
                'payment_intent_data[metadata][order_id]' => (string) $payment->order_id,
                'line_items[0][quantity]' => 1,
                'line_items[0][price_data][currency]' => strtolower($payment->currency),
                'line_items[0][price_data][unit_amount]' => (int) round(((float) $payment->amount) * 100),
                'line_items[0][price_data][product_data][name]' => 'Order '.$payment->order->order_number,
            ]);

        if ($response->failed()) {
            Log::error('Stripe checkout session failed', ['payment_id' => $payment->id, 'response' => $response->json()]);
            throw new ApiException('Unable to initiate Stripe payment.', 502);
        }

        $body = $response->json();

        $payment->update([
            'status' => PaymentStatus::PENDING,
            'gateway_payment_id' => $body['id'] ?? null,
            'gateway_reference' => $body['payment_intent'] ?? null,
            'checkout_url' => $body['url'] ?? null,
            'raw_response' => $body,
        ]);

        return $payment->refresh();
    }

    public function handleWebhook(array $payload, array $headers = []): ?Payment
    {
        $eventType = $payload['type'] ?? null;
        $object = $payload['data']['object'] ?? [];
        $transactionId = $object['client_reference_id'] ?? null;
        $paymentId = $object['metadata']['payment_id'] ?? null;

        $payment = $paymentId
            ? Payment::query()->find($paymentId)
            : Payment::query()->where('transaction_id', $transactionId)->first();

        if (! $payment) {
            return null;
        }

        return match ($eventType) {
            'checkout.session.completed', 'payment_intent.succeeded' => $this->mark($payment, PaymentStatus::SUCCEEDED, $payload),
            'checkout.session.expired', 'payment_intent.payment_failed' => $this->mark($payment, PaymentStatus::FAILED, $payload),
            default => $payment,
        };
    }

    private function mark(Payment $payment, string $status, array $payload): Payment
    {
        $payment->update([
            'status' => $status,
            'raw_response' => $payload,
            'paid_at' => $status === PaymentStatus::SUCCEEDED ? now() : $payment->paid_at,
        ]);

        return $payment->refresh();
    }
}
