<?php

use App\Models\Chofer;

test('a visitor can open a driver page without logging in', function () {
    $this->get(route('drivers.show', ['slug' => 'juan-perez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/drivers/show')
            ->where('slug', 'juan-perez')
            ->where('chofer', null));
});

test('el fondo de la card es el que se eligio', function () {
    Chofer::query()->create([
        'nombre' => 'Ana Ruiz',
        'slug' => 'ana-ruiz',
        'activo' => true,
        'fondo' => 'femenino',
    ]);

    $this->get(route('drivers.show', ['slug' => 'ana-ruiz']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('chofer.fondo', 'femenino'));
});

test('el modo de la pagina publica no sigue al del panel', function () {
    $this->withUnencryptedCookie('appearance', 'dark')
        ->withUnencryptedCookie('appearance_public', 'light')
        ->get(route('drivers.show', ['slug' => 'nadie']))
        ->assertOk()
        ->assertSee('data-appearance-scope="public"', false)
        ->assertDontSee('class="dark"', false);

    $this->withUnencryptedCookie('appearance', 'light')
        ->withUnencryptedCookie('appearance_public', 'dark')
        ->get(route('drivers.show', ['slug' => 'nadie']))
        ->assertOk()
        ->assertSee('class="dark"', false);
});

test('un slug inexistente o un chofer inactivo no traen ficha', function () {
    Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => false,
    ]);

    $this->get(route('drivers.show', ['slug' => 'nadie']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('chofer', null));

    $this->get(route('drivers.show', ['slug' => 'marcos-benitez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('chofer', null));
});

test('la pagina publica muestra los horarios del chofer', function () {
    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'juan-perez',
        'activo' => true,
    ]);

    $chofer->horarios()->create([
        'dia' => 'Domingo',
        'empieza' => '10:00',
    ]);

    $chofer->horarios()->create([
        'dia' => 'Lunes a sábado',
        'empieza' => '09:00',
        'termina' => '18:00',
        // 'nota' => 'Con reserva',
    ]);

    $this->get(route('drivers.show', ['slug' => 'juan-perez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('chofer.horarios', [
            [
                'dia' => 'Lunes a sábado',
                'empieza' => '09:00',
                'termina' => '18:00',
                // 'nota' => 'Con reserva',
            ],
            [
                'dia' => 'Domingo',
                'empieza' => '10:00',
                'termina' => null,
                // 'nota' => null,
            ],
        ]));
});

test('reserved addresses are not treated as a driver slug', function () {
    $this->get('/login')->assertOk();
    $this->get('/drivers')->assertRedirect(route('login'));
});
