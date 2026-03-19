<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validation->fails()) {
                return $this->sendError('Validation error', $validation->errors(), 422);
            }
            $validated = $validation->validated();

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return $this->sendError('Invalid credentials', [], 401);
            }

            $token = null;

            if ($user->role === 'superadmin') {
                $token = $user->createToken('superadmin_token', ['*'])->plainTextToken;
            } elseif ($user->role === 'admin') {
                $token = $user->createToken('admin_token', ['profile-manage', 'event-view', 'event-manage'])->plainTextToken;
            } else {
                $token = $user->createToken('user_token', ['profile-manage', 'event-view'])->plainTextToken;
            }

            return $this->sendResponse([
                'token' => $token,
                'user' => $user,
            ], 'Login successful');
        } catch (\Throwable $th) {
            return $this->sendError('Login failed', $th->getMessage(), code: 500);
        }
    }

    public function register(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
            ]);
            if ($validation->fails()) {
                return $this->sendError('Validation error', $validation->errors(), code: 422);
            }
            $found_user = User::where('email', $request->email)->first();
            if ($found_user) {
                return $this->sendError('Email already exists', code: 409);
            }
            $validated = $validation->validated();
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            event(new Registered($user));
            return $this->sendResponse($user, 'Registration successful');
        } catch (\Throwable $th) {
            return $this->sendError('Registration failed', $th->getMessage(), code: 500);
        }
    }
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return $this->sendResponse(null, 'Logout successful');
        } catch (\Throwable $th) {
            return $this->sendError('Logout failed', $th->getMessage(), code: 500);
        }
    }
    public function verifyEmail(Request $request, $id, $hash)
    {
        try {
            $user = User::findOrFail($id);
            if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
                return $this->sendError('Invalid verification link', code: 400);
            }
            if ($user->hasVerifiedEmail()) {
                return view('auth.verified');
            }
            $user->markEmailAsVerified();
            return view('auth.verified');
        } catch (\Throwable $th) {
            return $this->sendError('Email verification failed', $th->getMessage(), code: 500);
        }
    }
    public function sendVerificationEmail(Request $request)
    {
        try {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return $this->sendError('User not found', code: 404);
            }
            if ($user->hasVerifiedEmail()) {
                return $this->sendResponse(null, 'Email already verified');
            }
            $user->sendEmailVerificationNotification();
            return $this->sendResponse(null, 'Verification email resent');
        } catch (\Throwable $th) {
            return $this->sendError('Resend verification email failed', $th->getMessage(), code: 500);
        }
    }
    // TODO: Prevent admin from resetting password for their own account
    public function forgotPassword(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
            ]);
            if ($validation->fails()) {
                return $this->sendError('Validation error', $validation->errors(), code: 422);
            }
            $validated = $validation->validated();
            $found_user = User::where('email', $validated['email'])->first();
            if (!$found_user) {
                return $this->sendError('User not found', code: 404);
            }
            $status = Password::sendResetLink(
                ['email' => $validated['email']]
            );
            if ($status !== Password::ResetLinkSent) {
                throw new \Exception('Failed to send password reset link');
            }
            return $this->sendResponse(null, 'Password reset token generated');
        } catch (\Throwable $th) {
            return $this->sendError('Password reset failed', $th->getMessage(), code: 500);
        }
    }
    public function resetPassword(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'token' => 'required|string',
                'password' => 'required|string|min:6|confirmed',
                'password_confirmation' => 'required|same:password',
            ]);
            if ($validation->fails()) {
                return $this->sendError('Validation error', $validation->errors(), code: 422);
            }
            $validated = $validation->validated();
            $status = Password::reset(
                $validated,
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                    ])->setRememberToken(Str::random(60));
                    $user->email_verified_at = now();
                    $user->save();
                    event(new PasswordReset($user));
                }
            );
            if ($status === Password::PasswordReset) {
                return $this->sendResponse(null, 'Password reset successful');
            }
            throw new \Exception('Failed to reset password');
        } catch (\Throwable $th) {
            return $this->sendError('Password reset failed', $th->getMessage(), code: 500);
        }
    }
}
