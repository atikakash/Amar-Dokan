<?php

namespace App\Constants;

final class Role
{
    public const ADMIN = 'admin';
    public const MANAGER = 'manager';
    public const CUSTOMER = 'customer';

    public static function values(): array
    {
        return [self::ADMIN, self::MANAGER, self::CUSTOMER];
    }

    public static function staff(): array
    {
        return [self::ADMIN, self::MANAGER];
    }
}
