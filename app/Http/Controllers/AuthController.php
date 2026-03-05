<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validation->errors(),
                ], 422);
            }
            $validated = $validation->validated();

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return $this->sendError('Invalid credentials', code: 401);
            }

            $token = $user->createToken('user_token', ['tickets-purchase', 'tickets-view', 'profile-manage'])->plainTextToken;

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
}
