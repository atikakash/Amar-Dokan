<?php

namespace App\Enums;

final class PaymentStatus
{
    public const INITIATED = 'initiated';
    public const PENDING = 'pending';
    public const SUCCEEDED = 'succeeded';
    public const FAILED = 'failed';
    public const CANCELLED = 'cancelled';
    public const REFUNDED = 'refunded';

    public static function terminal(): array
    {
        return [self::SUCCEEDED, self::FAILED, self::CANCELLED, self::REFUNDED];
    }
}
