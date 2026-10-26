<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DriverPageController extends Controller
{
    /**
     * Show the public page for a driver slug.
     */
    public function show(string $slug): Response
    {
        return Inertia::render('public/drivers/show', [
            'slug' => $slug,
        ]);
    }
}
