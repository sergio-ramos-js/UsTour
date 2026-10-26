<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');

    Route::inertia('drivers', 'admin/drivers/index')->name('drivers.index');
});
