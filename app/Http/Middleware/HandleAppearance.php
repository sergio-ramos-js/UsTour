<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $publica = $request->routeIs('drivers.show');

        View::share('appearanceScope', $publica ? 'public' : 'admin');
        View::share('appearance', $request->cookie($publica ? 'appearance_public' : 'appearance') ?? 'system');

        return $next($request);
    }
}
