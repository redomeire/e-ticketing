<?php

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;

$register_endpoint = '/api/v1/auth/register';
function mockTurnstileResponse($success = true)
{
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response(['success' => $success], 200),
    ]);
}

test('new user can register with valid data and turnstile token', function () use ($register_endpoint) {
    mockTurnstileResponse(true);
    Event::fake();

    $payload = [
        'name' => 'Redo Meire',
        'email' => 'redo@example.com',
        'password' => 'secret123',
        'turnstileToken' => 'fake-token'
    ];

    $response = $this->postJson($register_endpoint, $payload);

    $response->assertStatus(200)
        ->assertJsonPath('message', 'Registration successful. Please check your email for verification link.');

    $this->assertDatabaseHas('users', ['email' => 'redo@example.com']);

    Event::assertDispatched(Registered::class);
});

test('user cannot register with an existing email', function () use ($register_endpoint) {
    mockTurnstileResponse(true);
    User::factory()->create(['email' => 'duplicate@example.com']);

    $payload = [
        'name' => 'Another User',
        'email' => 'duplicate@example.com',
        'password' => 'password123',
        'turnstileToken' => 'fake-token'
    ];

    $response = $this->postJson($register_endpoint, $payload);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('registration fails if name or password is missing', function () use ($register_endpoint) {
    $response = $this->postJson($register_endpoint, [
        'email' => 'new@example.com'
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'password']);
});

test('registration fails if turnstile token is invalid', function () use ($register_endpoint) {
    mockTurnstileResponse(false);

    $payload = [
        'name' => 'Hacker Bot',
        'email' => 'bot@example.com',
        'password' => 'password123',
        'turnstileToken' => 'invalid-token'
    ];

    $response = $this->postJson($register_endpoint, $payload);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['turnstileToken']);
});

