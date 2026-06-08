<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OrderRepository implements OrderRepositoryInterface
{
    public function paginateForUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $user->orders()->with('items')->latest()->paginate($perPage);
    }

    public function paginateAll(int $perPage = 15): LengthAwarePaginator
    {
        return Order::query()->with(['user', 'items'])->latest()->paginate($perPage);
    }

    public function findForUser(User $user, int $id): Order
    {
        $query = Order::query()->with(['user', 'items']);

        if (! $user->isStaff()) {
            $query->where('user_id', $user->id);
        }

        return $query->findOrFail($id);
    }

    public function createWithItems(array $orderData, array $items): Order
    {
        return DB::transaction(function () use ($orderData, $items): Order {
            $order = Order::query()->create($orderData);
            $order->items()->createMany($items);

            return $order->load(['user', 'items']);
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);

        return $order->refresh()->load(['user', 'items']);
    }
}
