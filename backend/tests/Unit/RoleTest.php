<?php

namespace Tests\Unit;

use App\Constants\Role;
use PHPUnit\Framework\TestCase;

class RoleTest extends TestCase
{
    public function test_roles_are_declared(): void
    {
        $this->assertSame(['admin', 'manager', 'customer'], Role::values());
    }
}
