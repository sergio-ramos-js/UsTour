<?php

use App\Http\Controllers\Public\DriverPageController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';

Route::get('{slug}', [DriverPageController::class, 'show'])
    ->name('drivers.show')
    ->where('slug', '^(?!login$|logout$|register$|forgot-password$|reset-password$|two-factor-challenge$|dashboard$|settings$|drivers$|up$)[a-z0-9]+(?:-[a-z0-9]+)*$');
