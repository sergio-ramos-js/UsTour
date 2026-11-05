<?php

use App\Models\Chofer;

test('un chofer reune sus lugares, horarios y vehiculo', function () {
    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $chofer->lugares()->create([
        'nombre' => 'Canal Beagle',
        'orden' => 1,
    ]);

    $chofer->horarios()->create([
        'dia' => 'Lunes a sábado',
        'empieza' => '09:00',
        'termina' => '18:00',
    ]);

    $chofer->vehiculo()->create([
        'marca' => 'Toyota',
        'modelo' => 'Hiace',
        'portaequipaje' => true,
        'capacidad_pasajeros' => 8,
        'capacidad_baul' => '4 valijas grandes',
    ]);

    $chofer->refresh();

    expect($chofer->lugares)->toHaveCount(1)
        ->and($chofer->lugares->first()->chofer->is($chofer))->toBeTrue()
        ->and($chofer->horarios)->toHaveCount(1)
        ->and($chofer->vehiculo->marca)->toBe('Toyota')
        ->and($chofer->vehiculo->portaequipaje)->toBeTrue()
        ->and($chofer->activo)->toBeTrue();
});
