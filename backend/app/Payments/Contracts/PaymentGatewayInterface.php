<?php

namespace App\Payments\Contracts;

use App\Models\Payment;

interface PaymentGatewayInterface
{
    public function initiate(Payment $payment, array $options = []): Payment;

    public function handleWebhook(array $payload, array $headers = []): ?Payment;
}
