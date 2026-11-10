<?php

use App\Http\Controllers\Admin\ChoferController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\HorarioController;


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
});
