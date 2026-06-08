<?php

namespace App\Repositories\Contracts;

use App\Models\Order;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    public function paginateForUser(User $user, int $perPage = 15): LengthAwarePaginator;

    public function paginateAll(int $perPage = 15): LengthAwarePaginator;

    public function findForUser(User $user, int $id): Order;

    public function createWithItems(array $orderData, array $items): Order;

    public function updateStatus(Order $order, string $status): Order;
}
