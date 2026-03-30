<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNotTelescopeUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $telescopeUser = session('telescope_user');

        if (!$telescopeUser) {
            return redirect()->route('telescope.login');
        }

        if (
            !in_array($telescopeUser['email'], [
                env('SUPERADMIN_EMAIL', 'superadmin@tedxbandung.com'),
            ])
        ) {
            session()->forget('telescope_user');
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
