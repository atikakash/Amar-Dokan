<?php

namespace App\Payments\Gateways;

use App\Enums\PaymentStatus;
use App\Exceptions\ApiException;
use App\Models\Payment;
use App\Payments\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SslCommerzGateway implements PaymentGatewayInterface
{
    public function initiate(Payment $payment, array $options = []): Payment
    {
        $storeId = config('payments.sslcommerz.store_id');
        $storePassword = config('payments.sslcommerz.store_password');

        if (! $storeId || ! $storePassword) {
            throw new ApiException('SSLCommerz is not configured.', 500);
        }

        $order = $payment->order;
        $user = $payment->user;

        $response = Http::asForm()->post(config('payments.sslcommerz.init_url'), [
            'store_id' => $storeId,
            'store_passwd' => $storePassword,
            'total_amount' => $payment->amount,
            'currency' => $payment->currency,
            'tran_id' => $payment->transaction_id,
            'success_url' => route('payments.sslcommerz.success'),
            'fail_url' => route('payments.sslcommerz.fail'),
            'cancel_url' => route('payments.sslcommerz.cancel'),
            'ipn_url' => route('payments.sslcommerz.ipn'),
            'cus_name' => $user->name,
            'cus_email' => $user->email,
            'cus_phone' => $user->phone ?? 'N/A',
            'cus_add1' => $order->shipping_address['address_line_1'] ?? 'N/A',
            'cus_city' => $order->shipping_address['city'] ?? 'N/A',
            'cus_country' => $order->shipping_address['country'] ?? 'Bangladesh',
            'shipping_method' => 'NO',
            'product_name' => 'Order '.$order->order_number,
            'product_category' => 'ecommerce',
            'product_profile' => 'general',
        ]);

        if ($response->failed() || ($response->json('status') !== 'SUCCESS')) {
            Log::error('SSLCommerz initiation failed', ['payment_id' => $payment->id, 'response' => $response->json()]);
            throw new ApiException('Unable to initiate SSLCommerz payment.', 502);
        }

        $body = $response->json();

        $payment->update([
            'status' => PaymentStatus::PENDING,
            'gateway_payment_id' => $body['sessionkey'] ?? null,
            'checkout_url' => $body['GatewayPageURL'] ?? null,
            'raw_response' => $body,
        ]);

        return $payment->refresh();
    }

    public function handleWebhook(array $payload, array $headers = []): ?Payment
    {
        $payment = Payment::query()->where('transaction_id', $payload['tran_id'] ?? null)->first();

        if (! $payment) {
            return null;
        }

        $status = strtoupper((string) ($payload['status'] ?? ''));

        if ($status === 'VALID' || $status === 'VALIDATED') {
            $validation = $this->validateTransaction($payload);

            if (! in_array(strtoupper((string) ($validation['status'] ?? '')), ['VALID', 'VALIDATED'], true)) {
                Log::warning('SSLCommerz validation rejected payment', [
                    'payment_id' => $payment->id,
                    'payload' => $payload,
                    'validation' => $validation,
                ]);

                $payment->update([
                    'status' => PaymentStatus::FAILED,
                    'raw_response' => ['payload' => $payload, 'validation' => $validation],
                ]);

                return $payment->refresh();
            }

            $payment->update([
                'status' => PaymentStatus::SUCCEEDED,
                'gateway_reference' => $payload['val_id'] ?? null,
                'raw_response' => ['payload' => $payload, 'validation' => $validation],
                'paid_at' => now(),
            ]);
        } elseif ($status === 'FAILED') {
            $payment->update(['status' => PaymentStatus::FAILED, 'raw_response' => $payload]);
        } elseif ($status === 'CANCELLED') {
            $payment->update(['status' => PaymentStatus::CANCELLED, 'raw_response' => $payload]);
        }

        return $payment->refresh();
    }

    private function validateTransaction(array $payload): array
    {
        if (empty($payload['val_id'])) {
            return ['status' => 'INVALID', 'message' => 'Missing val_id'];
        }

        $response = Http::get(config('payments.sslcommerz.validation_url'), [
            'val_id' => $payload['val_id'],
            'store_id' => config('payments.sslcommerz.store_id'),
            'store_passwd' => config('payments.sslcommerz.store_password'),
            'format' => 'json',
            'v' => 1,
        ]);

        if ($response->failed()) {
            return ['status' => 'INVALID', 'message' => 'Validation request failed'];
        }

        return $response->json() ?? ['status' => 'INVALID'];
    }
}
