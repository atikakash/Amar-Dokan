<?php

return [
    'currency' => env('PAYMENT_DEFAULT_CURRENCY', 'USD'),
    'frontend_success_url' => env('PAYMENT_SUCCESS_URL', 'http://localhost:3001/orders'),
    'frontend_cancel_url' => env('PAYMENT_CANCEL_URL', 'http://localhost:3001/checkout'),

    'sslcommerz' => [
        'sandbox' => env('SSLCOMMERZ_SANDBOX', true),
        'store_id' => env('SSLCOMMERZ_STORE_ID'),
        'store_password' => env('SSLCOMMERZ_STORE_PASSWORD'),
        'init_url' => env('SSLCOMMERZ_INIT_URL', 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'),
        'validation_url' => env('SSLCOMMERZ_VALIDATION_URL', 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'),
    ],

    'bkash' => [
        'sandbox' => env('BKASH_SANDBOX', true),
        'base_url' => env('BKASH_BASE_URL', 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout'),
        'app_key' => env('BKASH_APP_KEY'),
        'app_secret' => env('BKASH_APP_SECRET'),
        'username' => env('BKASH_USERNAME'),
        'password' => env('BKASH_PASSWORD'),
    ],

    'stripe' => [
        'secret_key' => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],
];
