<?php

use App\Models\Chofer;
use App\Models\Lugar;
use App\Models\User;
use App\Models\Vehiculo;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->where('conteos.choferes', 0)
        ->where('conteos.lugares', 0)
        ->where('conteos.vehiculos', 0));
});

test('el dashboard cuenta lo cargado', function () {
    $this->actingAs(User::factory()->create());

    Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);
    Lugar::query()->create([
        'nombre' => 'Laguna Esmeralda',
        'ciudad' => 'Ushuaia',
    ]);
    Vehiculo::query()->create([
        'marca' => 'Toyota',
        'modelo' => 'Hiace',
        'anio' => 2019,
        'portaequipaje' => false,
        'capacidad_pasajeros' => 8,
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('conteos.choferes', 1)
            ->where('conteos.lugares', 1)
            ->where('conteos.vehiculos', 1));
});
