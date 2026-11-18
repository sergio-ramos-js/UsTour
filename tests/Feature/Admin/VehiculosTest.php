<?php

use App\Models\Chofer;
use App\Models\User;
use App\Models\Vehiculo;

test('un visitante no entra al catalogo de vehiculos', function () {
    $this->get(route('vehiculos.index'))->assertRedirect(route('login'));
});

test('un admin carga un vehiculo y lo asigna a dos choferes', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('vehiculos.store'), [
        'marca' => 'Toyota',
        'modelo' => 'Hiace',
        'anio' => 2019,
        'color' => 'Blanco',
        'portaequipaje' => '1',
        'capacidad_pasajeros' => 8,
        'capacidad_baul' => '3 a 4 valijas medianas',
    ])->assertRedirect(route('vehiculos.index'))
        ->assertInertiaFlash('toast', [
            'type' => 'success',
            'message' => 'Vehículo guardado correctamente.',
        ]);

    $vehiculo = Vehiculo::query()->first();

    expect($vehiculo->anio)->toBe(2019)
        ->and($vehiculo->portaequipaje)->toBeTrue();

    $marcos = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);
    $ana = Chofer::query()->create([
        'nombre' => 'Ana Ruiz',
        'slug' => 'ana-ruiz',
        'activo' => true,
    ]);

    $this->put(route('drivers.update', $marcos), [
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => '1',
        'vehiculo_id' => $vehiculo->id,
    ])->assertRedirect(route('drivers.index'));

    $this->put(route('drivers.update', $ana), [
        'nombre' => 'Ana Ruiz',
        'slug' => 'ana-ruiz',
        'activo' => '1',
        'vehiculo_id' => $vehiculo->id,
    ])->assertRedirect(route('drivers.index'));

    expect($vehiculo->choferes()->pluck('slug')->sort()->values()->all())->toBe(['ana-ruiz', 'marcos-benitez']);

    $this->get(route('drivers.show', ['slug' => 'marcos-benitez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('chofer.vehiculo.marca', 'Toyota')
            ->where('chofer.vehiculo.modelo', 'Hiace')
            ->where('chofer.vehiculo.anio', 2019)
            ->where('chofer.vehiculo.color', 'Blanco')
            ->where('chofer.vehiculo.capacidad_pasajeros', 8)
            ->where('chofer.vehiculo.portaequipaje', true)
            ->missing('chofer.vehiculo.foto_url'));
});
