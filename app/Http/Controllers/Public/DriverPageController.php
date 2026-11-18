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
            ->with(['horarios', 'lugares.fotos', 'vehiculo'])
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
                'fondo' => $chofer->fondo,
                'horarios' => $chofer->horarios->map(fn ($horario) => [
                    'dia' => $horario->dia,
                    'empieza' => $this->hora($horario->empieza),
                    'termina' => $this->hora($horario->termina),
                    // 'nota' => $horario->nota,
                ])->values()->all(),
                'vehiculo' => $chofer->vehiculo ? [
                    'marca' => $chofer->vehiculo->marca,
                    'modelo' => $chofer->vehiculo->modelo,
                    'anio' => $chofer->vehiculo->anio,
                    'color' => $chofer->vehiculo->color,
                    'capacidad_pasajeros' => $chofer->vehiculo->capacidad_pasajeros,
                    'capacidad_baul' => $chofer->vehiculo->capacidad_baul,
                    'portaequipaje' => $chofer->vehiculo->portaequipaje,
                ] : null,
                'lugares' => $chofer->lugares->map(fn ($lugar) => [
                    'nombre' => $lugar->nombre,
                    'descripcion' => $lugar->descripcion,
                    'fotos' => $lugar->fotos
                        ->map(fn ($foto) => Storage::disk('public')->url($foto->archivo))
                        ->values()
                        ->all(),
                ])->values()->all(),
            ] : null,
        ]);
    }

    private function hora(?string $valor): ?string
    {
        return $valor === null ? null : Carbon::parse($valor)->format('H:i');
    }
}