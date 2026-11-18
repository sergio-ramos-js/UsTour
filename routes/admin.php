<?php

use App\Http\Controllers\Admin\ChoferController;
use App\Http\Controllers\Admin\HorarioController;
use App\Http\Controllers\Admin\LugarController;
use App\Http\Controllers\Admin\VehiculoController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');

    Route::resource('drivers', ChoferController::class)
        ->except(['show'])
        ->parameters(['drivers' => 'chofer']);
    Route::post('drivers/{chofer}/horarios', [HorarioController::class, 'store'])
        ->name('drivers.horarios.store');

    Route::put('drivers/{chofer}/horarios/{horario}', [HorarioController::class, 'update'])
        ->name('drivers.horarios.update')
        ->scopeBindings();

    Route::delete('drivers/{chofer}/horarios/{horario}', [HorarioController::class, 'destroy'])
        ->name('drivers.horarios.destroy')
        ->scopeBindings();

    Route::resource('lugares', LugarController::class)
        ->except(['show'])
        ->parameters(['lugares' => 'lugar']);

    Route::delete('lugares/{lugar}/fotos/{foto}', [LugarController::class, 'destroyFoto'])
        ->name('lugares.fotos.destroy')
        ->scopeBindings();

    Route::resource('vehiculos', VehiculoController::class)
        ->except(['show'])
        ->parameters(['vehiculos' => 'vehiculo']);
});
