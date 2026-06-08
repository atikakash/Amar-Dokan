<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'token_type' => $this->resource['token_type'],
            'access_token' => $this->resource['access_token'],
            'user' => new UserResource($this->resource['user']),
        ];
    }
}
