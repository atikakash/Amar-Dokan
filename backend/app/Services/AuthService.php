<?php

namespace App\Services;

use App\Constants\Role;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\PasswordBroker as PasswordBrokerContract;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private readonly UserRepositoryInterface $users)
    {
    }

    public function register(array $data): array
    {
        $user = $this->users->create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => $data['password'],
            'phone' => $data['phone'] ?? null,
            'role' => Role::CUSTOMER,
        ]);

        event(new Registered($user));

        Log::info('Customer registered', ['user_id' => $user->id]);

        return $this->tokenResponse($user);
    }

    public function login(array $data): array
    {
        $user = $this->users->findByEmail(strtolower($data['email']));

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        Log::info('User logged in', ['user_id' => $user->id]);

        return $this->tokenResponse($user);
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
        Log::info('User logged out', ['user_id' => $user->id]);
    }

    public function forgotPassword(string $email): string
    {
        return Password::sendResetLink(['email' => strtolower($email)]);
    }

    public function resetPassword(array $data): string
    {
        return Password::reset($data, function (User $user, string $password): void {
            $user->forceFill([
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();
        });
    }

    public function updateProfile(User $user, array $data): User
    {
        return $this->users->update($user, $data);
    }

    public function verifyEmail(User $user): bool
    {
        if ($user->hasVerifiedEmail()) {
            return true;
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            return true;
        }

        return false;
    }

    public function passwordResetFailed(string $status): void
    {
        if ($status !== PasswordBrokerContract::RESET_LINK_SENT && $status !== PasswordBrokerContract::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => [__($status)]]);
        }
    }

    private function tokenResponse(User $user): array
    {
        $token = $user->createToken('api-token', ['*'])->plainTextToken;

        return [
            'token_type' => 'Bearer',
            'access_token' => $token,
            'user' => $user,
        ];
    }
}
