<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class LogOrderPlaced implements ShouldQueue
{
    public function handle(OrderPlaced $event): void
    {
        Log::info('Order placed', [
            'order_id' => $event->order->id,
            'order_number' => $event->order->order_number,
            'user_id' => $event->order->user_id,
            'total' => $event->order->total,
        ]);
    }
}
