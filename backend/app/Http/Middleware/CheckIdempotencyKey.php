<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIdempotencyKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('Checking idempotency key for request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
        ]);
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return $next($request);
        }
        $key = $request->header('Idempotency-Key');
        if (!$key || !Str::isUuid($key)) {
            return response()->json([
                'success' => false,
                'message' => 'Idempotency-Key header is required and must be a valid UUID.',
            ], 400);
        }
        $cache_key = 'idempotency:' . $key;
        $fingerprint = sha1($request->getContent());
        $full_cache_key = $cache_key . ':' . $fingerprint;
        if (Cache::has($full_cache_key)) {
            $response = Cache::get($full_cache_key);
            return response()->json($response['data'], $response['status']);
        }
        $response = $next($request);
        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            Cache::put($full_cache_key, [
                'status' => $response->getStatusCode(),
                'body' => $response->getContent(),
                'headers' => $response->headers->all(),
            ], now()->addHours(24));
        }
        return $response;
    }
}
