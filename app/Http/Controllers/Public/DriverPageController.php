<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Chofer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DriverPageController extends Controller
{
    /**
     * Show the public page for a driver slug.
     */
    public function show(string $slug): Response
    {
        $chofer = Chofer::query()
            ->with('horarios')
            ->where('slug', $slug)
            ->where('activo', true)
            ->first();

        return Inertia::render('public/drivers/show', [
            'slug' => $slug,
            'chofer' => $chofer ? [
                'nombre' => $chofer->nombre,
                'descripcion' => $chofer->descripcion,
                'telefono' => $chofer->telefono,
                'telefono_secundario' => $chofer->telefono_secundario,
                'correo' => $chofer->correo,
                'whatsapp' => $chofer->telefono
                    ? preg_replace('/\D/', '', $chofer->telefono)
                    : null,
                'foto_url' => $chofer->foto
                    ? Storage::disk('public')->url($chofer->foto)
                    : null,
                'horarios' => $chofer->horarios->map(fn ($horario) => [
                    'dia' => $horario->dia,
                    'empieza' => $this->hora($horario->empieza),
                    'termina' => $this->hora($horario->termina),
                    'nota' => $horario->nota,
                ])->values()->all(),
            ] : null,
        ]);
    }

    private function hora(?string $valor): ?string
    {
        return $valor === null ? null : Carbon::parse($valor)->format('H:i');
    }
}