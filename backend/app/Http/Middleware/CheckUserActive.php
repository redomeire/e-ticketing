<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact support.',
            ], 403);
        }
        if ($user->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deleted. Please contact support.',
            ], 403);
        }
        if (!$user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is not verified. Pleae check your email for verification link.',
            ], 403);
        }
        return $next($request);
    }
}
