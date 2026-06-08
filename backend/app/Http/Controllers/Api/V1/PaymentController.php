<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentGateway;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\InitiatePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments)
    {
    }

    public function initiate(InitiatePaymentRequest $request): PaymentResource
    {
        return new PaymentResource($this->payments->initiate($request->user(), $request->validated()));
    }

    public function show(Request $request, Payment $payment): PaymentResource
    {
        return new PaymentResource($this->payments->show($request->user(), $payment));
    }

    public function stripeWebhook(Request $request): JsonResponse
    {
        if (! $this->validStripeSignature($request)) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $this->payments->handleGatewayWebhook(PaymentGateway::STRIPE, $request->all(), $request->headers->all());

        return response()->json(['received' => true]);
    }

    public function sslCommerzIpn(Request $request): JsonResponse
    {
        $this->payments->handleGatewayWebhook(PaymentGateway::SSLCOMMERZ, $request->all(), $request->headers->all());

        return response()->json(['received' => true]);
    }

    public function sslCommerzSuccess(Request $request): RedirectResponse
    {
        $payment = $this->payments->handleGatewayWebhook(PaymentGateway::SSLCOMMERZ, $request->all(), $request->headers->all());

        return redirect()->away(config('payments.frontend_success_url').'?payment_id='.$payment?->id.'&status=success');
    }

    public function sslCommerzFail(Request $request): RedirectResponse
    {
        $payment = $this->payments->handleGatewayWebhook(PaymentGateway::SSLCOMMERZ, $request->all(), $request->headers->all());

        if ($payment) {
            $this->payments->mark($payment, PaymentStatus::FAILED, $request->all());
        }

        return redirect()->away(config('payments.frontend_cancel_url').'?payment_id='.$payment?->id.'&status=failed');
    }

    public function sslCommerzCancel(Request $request): RedirectResponse
    {
        $payment = $this->payments->handleGatewayWebhook(PaymentGateway::SSLCOMMERZ, $request->all(), $request->headers->all());

        if ($payment) {
            $this->payments->mark($payment, PaymentStatus::CANCELLED, $request->all());
        }

        return redirect()->away(config('payments.frontend_cancel_url').'?payment_id='.$payment?->id.'&status=cancelled');
    }

    public function bkashCallback(Request $request): RedirectResponse
    {
        $payment = $this->payments->handleGatewayWebhook(PaymentGateway::BKASH, $request->all(), $request->headers->all());
        $status = $payment?->status === PaymentStatus::SUCCEEDED ? 'success' : 'failed';
        $url = $status === 'success' ? config('payments.frontend_success_url') : config('payments.frontend_cancel_url');

        return redirect()->away($url.'?payment_id='.$payment?->id.'&status='.$status);
    }

    private function validStripeSignature(Request $request): bool
    {
        $secret = config('payments.stripe.webhook_secret');

        if (! $secret) {
            Log::warning('Stripe webhook secret is not configured; accepting webhook in unsigned mode.');

            return true;
        }

        $signature = $request->header('Stripe-Signature');

        if (! $signature) {
            return false;
        }

        $timestamp = null;
        $signatures = [];

        foreach (explode(',', $signature) as $part) {
            [$key, $value] = array_pad(explode('=', $part, 2), 2, null);
            if ($key === 't') {
                $timestamp = $value;
            }
            if ($key === 'v1') {
                $signatures[] = $value;
            }
        }

        if (! $timestamp || $signatures === []) {
            return false;
        }

        $signedPayload = $timestamp.'.'.$request->getContent();
        $expected = hash_hmac('sha256', $signedPayload, $secret);

        foreach ($signatures as $candidate) {
            if (hash_equals($expected, $candidate)) {
                return true;
            }
        }

        return false;
    }
}
