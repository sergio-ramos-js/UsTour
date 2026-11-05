<?php

use App\Http\Controllers\Admin\ChoferController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');

    Route::resource('drivers', ChoferController::class)
        ->except(['show'])
        ->parameters(['drivers' => 'chofer']);
});
