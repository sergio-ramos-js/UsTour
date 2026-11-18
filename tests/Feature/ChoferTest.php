<?php

use App\Models\Chofer;
use App\Models\Vehiculo;

test('un chofer reune sus lugares, horarios y vehiculo', function () {
    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $lugar = $chofer->lugares()->create([
        'nombre' => 'Canal Beagle',
        'ciudad' => 'Ushuaia',
    ], ['orden' => 1]);

    $chofer->horarios()->create([
        'dia' => 'Lunes a sábado',
        'empieza' => '09:00',
        'termina' => '18:00',
    ]);

    $vehiculo = Vehiculo::query()->create([
        'marca' => 'Toyota',
        'modelo' => 'Hiace',
        'anio' => 2018,
        'portaequipaje' => true,
        'capacidad_pasajeros' => 8,
        'capacidad_baul' => '4 valijas grandes',
    ]);
    $chofer->vehiculo()->associate($vehiculo);
    $chofer->save();

    $chofer->refresh();

    expect($chofer->lugares)->toHaveCount(1)
        ->and($chofer->lugares->first()->is($lugar))->toBeTrue()
        ->and($lugar->choferes->first()->is($chofer))->toBeTrue()
        ->and($chofer->horarios)->toHaveCount(1)
        ->and($chofer->vehiculo->marca)->toBe('Toyota')
        ->and($chofer->vehiculo->anio)->toBe(2018)
        ->and($chofer->vehiculo->portaequipaje)->toBeTrue()
        ->and($vehiculo->choferes->first()->is($chofer))->toBeTrue()
        ->and($chofer->activo)->toBeTrue();
});
