<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chofer;
use App\Models\Lugar;
use App\Models\Vehiculo;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'conteos' => [
                'choferes' => Chofer::query()->count(),
                'lugares' => Lugar::query()->count(),
                'vehiculos' => Vehiculo::query()->count(),
            ],
        ]);
    }
}
