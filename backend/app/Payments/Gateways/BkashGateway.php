<?php

namespace App\Payments\Gateways;

use App\Enums\PaymentStatus;
use App\Exceptions\ApiException;
use App\Models\Payment;
use App\Payments\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BkashGateway implements PaymentGatewayInterface
{
    public function initiate(Payment $payment, array $options = []): Payment
    {
        $token = $this->token();
        $baseUrl = rtrim(config('payments.bkash.base_url'), '/');

        $response = Http::withHeaders($this->headers($token))->post($baseUrl.'/create', [
            'mode' => '0011',
            'payerReference' => (string) $payment->user_id,
            'callbackURL' => route('payments.bkash.callback'),
            'amount' => (string) $payment->amount,
            'currency' => $payment->currency === 'BDT' ? 'BDT' : $payment->currency,
            'intent' => 'sale',
            'merchantInvoiceNumber' => $payment->transaction_id,
        ]);

        if ($response->failed() || ! $response->json('paymentID')) {
            Log::error('bKash create payment failed', ['payment_id' => $payment->id, 'response' => $response->json()]);
            throw new ApiException('Unable to initiate bKash payment.', 502);
        }

        $body = $response->json();

        $payment->update([
            'status' => PaymentStatus::PENDING,
            'gateway_payment_id' => $body['paymentID'],
            'checkout_url' => $body['bkashURL'] ?? null,
            'raw_response' => $body,
        ]);

        return $payment->refresh();
    }

    public function handleWebhook(array $payload, array $headers = []): ?Payment
    {
        $payment = Payment::query()->where('gateway_payment_id', $payload['paymentID'] ?? null)->first();

        if (! $payment) {
            return null;
        }

        if (($payload['status'] ?? null) === 'success') {
            return $this->execute($payment);
        }

        $payment->update([
            'status' => ($payload['status'] ?? null) === 'cancel' ? PaymentStatus::CANCELLED : PaymentStatus::FAILED,
            'raw_response' => $payload,
        ]);

        return $payment->refresh();
    }

    private function execute(Payment $payment): Payment
    {
        $token = $this->token();
        $response = Http::withHeaders($this->headers($token))->post(rtrim(config('payments.bkash.base_url'), '/').'/execute', [
            'paymentID' => $payment->gateway_payment_id,
        ]);

        if ($response->failed() || $response->json('transactionStatus') !== 'Completed') {
            $payment->update([
                'status' => PaymentStatus::FAILED,
                'raw_response' => $response->json(),
            ]);

            return $payment->refresh();
        }

        $payment->update([
            'status' => PaymentStatus::SUCCEEDED,
            'gateway_reference' => $response->json('trxID'),
            'raw_response' => $response->json(),
            'paid_at' => now(),
        ]);

        return $payment->refresh();
    }

    private function token(): string
    {
        return Cache::remember('bkash_token', now()->addMinutes(50), function (): string {
            $response = Http::withHeaders([
                'username' => config('payments.bkash.username'),
                'password' => config('payments.bkash.password'),
            ])->post(rtrim(config('payments.bkash.base_url'), '/').'/token/grant', [
                'app_key' => config('payments.bkash.app_key'),
                'app_secret' => config('payments.bkash.app_secret'),
            ]);

            if ($response->failed() || ! $response->json('id_token')) {
                throw new ApiException('Unable to authenticate with bKash.', 502);
            }

            return $response->json('id_token');
        });
    }

    private function headers(string $token): array
    {
        return [
            'Authorization' => $token,
            'X-APP-Key' => config('payments.bkash.app_key'),
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];
    }
}
