<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders)
    {
    }

    public function index(Request $request)
    {
        return OrderResource::collection($this->orders->list($request->user(), (int) $request->integer('per_page', 15)));
    }

    public function store(StoreOrderRequest $request)
    {
        return (new OrderResource($this->orders->create($request->user(), $request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, int $order): OrderResource
    {
        return new OrderResource($this->orders->show($request->user(), $order));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): OrderResource
    {
        return new OrderResource($this->orders->updateStatus($order, $request->validated('status')));
    }
}
