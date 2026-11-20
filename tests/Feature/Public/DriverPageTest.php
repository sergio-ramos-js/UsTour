<?php

use App\Models\Chofer;
use App\Models\Lugar;
use App\Models\User;

test('la ficha publica arranca en espanol', function () {
    $this->get(route('drivers.show', ['slug' => 'nadie']))
        ->assertOk()
        ->assertSee('<title translate="no" class="notranslate">', false)
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'es')
            ->where('textos.chofer', 'Chofer'));
});

test('la cookie de idioma cambia los textos de la ficha', function () {
    $this->withUnencryptedCookie('locale', 'en')
        ->get(route('drivers.show', ['slug' => 'nadie']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'en')
            ->where('textos.chofer', 'Driver')
            ->where('textos.lugares', 'Places'));

    $this->withUnencryptedCookie('locale', 'fr')
        ->get(route('drivers.show', ['slug' => 'nadie']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('locale', 'es'));
});

test('a visitor can open a driver page without logging in', function () {
    $this->get(route('drivers.show', ['slug' => 'juan-perez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/drivers/show')
            ->where('slug', 'juan-perez')
            ->where('chofer', null));
});

test('la imagen de fondo de la tarjeta es la que se eligio', function () {
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

test('la ficha usa la descripcion del idioma y si falta vuelve al espanol', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('lugares.store'), [
        'nombre' => 'Laguna Esmeralda',
        'descripcion' => 'Caminata hasta la laguna.',
        'descripcion_en' => 'A walk to the lagoon.',
        'descripcion_pt' => '   ',
        'ciudad' => 'Ushuaia',
    ])->assertRedirect(route('lugares.index'));

    $lugar = Lugar::query()->first();

    $this->post(route('drivers.store'), [
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => '1',
        'descripcion' => 'Te llevo por Ushuaia.',
        'descripcion_en' => 'I drive you around Ushuaia.',
        'descripcion_zh' => '我带你游览乌斯怀亚。',
        'lugares' => [
            $lugar->id => ['id' => $lugar->id, 'elegido' => '1', 'orden' => 1],
        ],
    ])->assertRedirect(route('drivers.index'));

    $chofer = Chofer::query()->where('slug', 'marcos-benitez')->first();

    expect($chofer->descripcion_en)->toBe('I drive you around Ushuaia.')
        ->and($chofer->descripcion_pt)->toBeNull()
        ->and($lugar->refresh()->descripcion_pt)->toBeNull()
        ->and($lugar->descripcion_en)->toBe('A walk to the lagoon.');

    $this->get(route('lugares.edit', $lugar))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('lugar.descripcion_en', 'A walk to the lagoon.'));

    $this->get(route('drivers.edit', $chofer))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('chofer.descripcion_zh', '我带你游览乌斯怀亚。'));

    $this->withUnencryptedCookie('locale', 'en')
        ->get(route('drivers.show', ['slug' => 'marcos-benitez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('chofer.descripcion', 'I drive you around Ushuaia.')
            ->where('chofer.lugares.0.nombre', 'Laguna Esmeralda')
            ->where('chofer.lugares.0.descripcion', 'A walk to the lagoon.'));

    $this->withUnencryptedCookie('locale', 'pt')
        ->get(route('drivers.show', ['slug' => 'marcos-benitez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('chofer.descripcion', 'Te llevo por Ushuaia.')
            ->where('chofer.lugares.0.descripcion', 'Caminata hasta la laguna.'));

    $this->withUnencryptedCookie('locale', 'zh')
        ->get(route('drivers.show', ['slug' => 'marcos-benitez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('chofer.descripcion', '我带你游览乌斯怀亚。')
            ->where('chofer.lugares.0.descripcion', 'Caminata hasta la laguna.'));
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
