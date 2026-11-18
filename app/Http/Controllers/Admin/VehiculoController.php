<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VehiculoRequest;
use App\Models\Vehiculo;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehiculoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/vehiculos/index', [
            'vehiculos' => Vehiculo::query()
                ->orderBy('marca')
                ->orderBy('modelo')
                ->orderBy('anio')
                ->get()
                ->map(fn (Vehiculo $vehiculo) => [
                    'id' => $vehiculo->id,
                    'marca' => $vehiculo->marca,
                    'modelo' => $vehiculo->modelo,
                    'anio' => $vehiculo->anio,
                    'color' => $vehiculo->color,
                    'capacidad_pasajeros' => $vehiculo->capacidad_pasajeros,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/vehiculos/form', [
            'vehiculo' => null,
        ]);
    }

    public function store(VehiculoRequest $request): RedirectResponse
    {
        Vehiculo::query()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Vehículo guardado correctamente.',
        ]);

        return redirect()->route('vehiculos.index');
    }

    public function edit(Vehiculo $vehiculo): Response
    {
        return Inertia::render('admin/vehiculos/form', [
            'vehiculo' => [
                'id' => $vehiculo->id,
                'marca' => $vehiculo->marca,
                'modelo' => $vehiculo->modelo,
                'anio' => $vehiculo->anio,
                'color' => $vehiculo->color,
                'portaequipaje' => $vehiculo->portaequipaje,
                'capacidad_pasajeros' => $vehiculo->capacidad_pasajeros,
                'capacidad_baul' => $vehiculo->capacidad_baul,
            ],
        ]);
    }

    public function update(VehiculoRequest $request, Vehiculo $vehiculo): RedirectResponse
    {
        $vehiculo->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Vehículo guardado correctamente.',
        ]);

        return redirect()->route('vehiculos.index');
    }

    public function destroy(Vehiculo $vehiculo): RedirectResponse
    {
        $vehiculo->delete();

        return redirect()->route('vehiculos.index');
    }
}
