<?php

namespace App\Enums;

final class PaymentGateway
{
    public const SSLCOMMERZ = 'sslcommerz';
    public const BKASH = 'bkash';
    public const STRIPE = 'stripe';

    public static function values(): array
    {
        return [self::SSLCOMMERZ, self::BKASH, self::STRIPE];
    }
}
