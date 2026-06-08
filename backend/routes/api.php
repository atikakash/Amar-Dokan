<?php

use App\Constants\Role;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CouponController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', fn () => response()->json(['status' => 'ok']));

    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        Route::get('/reset-password/{token}', fn (Request $request, string $token) => response()->json([
            'token' => $token,
            'email' => $request->query('email'),
        ]))->name('password.reset');
    });

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
    Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

    Route::post('/payments/webhooks/stripe', [PaymentController::class, 'stripeWebhook'])->name('payments.stripe.webhook');
    Route::post('/payments/webhooks/sslcommerz/ipn', [PaymentController::class, 'sslCommerzIpn'])->name('payments.sslcommerz.ipn');
    Route::match(['get', 'post'], '/payments/sslcommerz/success', [PaymentController::class, 'sslCommerzSuccess'])->name('payments.sslcommerz.success');
    Route::match(['get', 'post'], '/payments/sslcommerz/fail', [PaymentController::class, 'sslCommerzFail'])->name('payments.sslcommerz.fail');
    Route::match(['get', 'post'], '/payments/sslcommerz/cancel', [PaymentController::class, 'sslCommerzCancel'])->name('payments.sslcommerz.cancel');
    Route::match(['get', 'post'], '/payments/bkash/callback', [PaymentController::class, 'bkashCallback'])->name('payments.bkash.callback');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::prefix('auth')->group(function (): void {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/profile', [AuthController::class, 'profile']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::post('/email/verification-notification', [AuthController::class, 'resendVerification'])->middleware('throttle:6,1');
            Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
        });

        Route::middleware('verified')->group(function (): void {
            Route::get('/cart', [CartController::class, 'show']);
            Route::post('/cart/items', [CartController::class, 'add']);
            Route::put('/cart/items/{item}', [CartController::class, 'update']);
            Route::delete('/cart/items/{item}', [CartController::class, 'remove']);
            Route::delete('/cart', [CartController::class, 'clear']);

            Route::get('/wishlist', [WishlistController::class, 'index']);
            Route::post('/wishlist', [WishlistController::class, 'store']);
            Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy']);

            Route::get('/orders', [OrderController::class, 'index']);
            Route::post('/orders', [OrderController::class, 'store']);
            Route::get('/orders/{order}', [OrderController::class, 'show']);

            Route::post('/payments/initiate', [PaymentController::class, 'initiate']);
            Route::get('/payments/{payment}', [PaymentController::class, 'show']);

            Route::post('/reviews', [ReviewController::class, 'store']);
            Route::put('/reviews/{review}', [ReviewController::class, 'update']);
            Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
        });

        Route::middleware('role:'.Role::ADMIN.','.Role::MANAGER)->group(function (): void {
            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{category}', [CategoryController::class, 'update']);
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);

            Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

            Route::apiResource('coupons', CouponController::class)->except(['create', 'edit']);
        });
    });
});
