<?php

use App\Models\Chofer;
use App\Models\Lugar;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('un visitante no entra al catalogo de lugares', function () {
    $this->get(route('lugares.index'))->assertRedirect(route('login'));
});

test('un admin carga un lugar y lo asigna a un chofer', function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());

    $this->post(route('lugares.store'), [
        'nombre' => 'Laguna Esmeralda',
        'descripcion' => 'Caminata hasta la laguna.',
        'ciudad' => '',
        'fotos' => [
            UploadedFile::fake()->image('laguna.jpg'),
            UploadedFile::fake()->image('sendero.jpg'),
        ],
    ])->assertRedirect(route('lugares.index'))
        ->assertInertiaFlash('toast', [
            'type' => 'success',
            'message' => 'Lugar guardado correctamente.',
        ]);

    $lugar = Lugar::query()->first();

    expect($lugar->ciudad)->toBe('Ushuaia')
        ->and($lugar->fotos)->toHaveCount(2);

    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $this->put(route('drivers.update', $chofer), [
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => '1',
        'lugares' => [
            $lugar->id => ['id' => $lugar->id, 'elegido' => '1', 'orden' => 2],
        ],
    ])->assertRedirect(route('drivers.index'));

    expect($chofer->lugares()->first()->pivot->orden)->toBe(2);

    $this->get(route('drivers.show', ['slug' => 'marcos-benitez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('chofer.lugares.0.nombre', 'Laguna Esmeralda')
            ->where('chofer.lugares.0.descripcion', 'Caminata hasta la laguna.')
            ->has('chofer.lugares.0.fotos', 2));
});
