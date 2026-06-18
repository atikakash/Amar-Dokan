<?php

$defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://amar-dokan.vercel.app',
    'https://amar-dokan-teal.vercel.app',
    'https://amar-dokan-admin.vercel.app',
];

$envOrigins = array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', ''))));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_unique([...$defaultOrigins, ...$envOrigins])),
    'allowed_origins_patterns' => ['#^https://amar-dokan(-[a-z0-9]+)?(-atik-s-projects4)?\.vercel\.app$#'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
