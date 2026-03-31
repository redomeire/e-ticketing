<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

$login_endpoint = '/api/v1/auth/login';

function mockTurnstileSuccess()
{
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response(['success' => true], 200),
    ]);
}

test('user can login with correct credentials', function () use ($login_endpoint) {
    mockTurnstileSuccess();
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post($login_endpoint, [
        'email' => $user->email,
        'password' => 'password123',
        'turnstileToken' => 'test-turnstile-token',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'token',
            'user' => [
                'id',
                'name',
                'email',
            ],
        ]);

    $this->assertAuthenticatedAs($user);
});

test('user cannot login with incorrect password', function () use ($login_endpoint) {
    mockTurnstileSuccess();
    $user = User::factory()->create([
        'password' => Hash::make('correct-password'),
    ]);

    $response = $this->postJson($login_endpoint, [
        'email' => $user->email,
        'password' => 'wrong-password',
        'turnstileToken' => 'test-turnstile-token',
    ]);

    $response->assertStatus(401)
        ->assertJsonValidationErrors(['email']);

    $this->assertGuest();
});

test('user cannot login with too many attempts', function () use ($login_endpoint) {
    mockTurnstileSuccess();
    $user = User::factory()->create([
        'password' => Hash::make('correct-password'),
    ]);

    for ($i = 0; $i < 5; $i++) {
        $response = $this->postJson($login_endpoint, [
            'email' => $user->email,
            'password' => 'wrong-password',
            'turnstileToken' => 'test-turnstile-token',
        ]);
    }

    $response = $this->postJson($login_endpoint, [
        'email' => $user->email,
        'password' => 'wrong-password',
        'turnstileToken' => 'test-turnstile-token',
    ]);

    $response->assertStatus(429)
        ->assertJsonValidationErrors(['email']);
});

