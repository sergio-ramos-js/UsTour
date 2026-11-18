<?php

use App\Models\Chofer;
use App\Models\User;

test('un admin carga horarios al crear el chofer', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('drivers.store'), [
        'nombre' => 'Marcos Benítez',
        'activo' => '1',
        'horarios' => [
            [
                'dia' => 'Lunes a sábado',
                'empieza' => '09:00',
                'termina' => '18:00',
                // 'nota' => 'Con reserva',
            ],
            [
                'dia' => '',
                'empieza' => '',
                'termina' => '',
                // 'nota' => '',
            ],
        ],
    ])->assertRedirect();

    $chofer = Chofer::query()->first();
    $horario = $chofer->horarios()->first();

    expect($chofer->horarios)->toHaveCount(1)
        ->and($horario->dia)->toBe('Lunes a sábado')
        ->and(substr((string) $horario->empieza, 0, 5))->toBe('09:00');
        // ->and($horario->nota)->toBe('Con reserva');
});

test('al crear el chofer la hora de fin no puede ser anterior', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('drivers.store'), [
        'nombre' => 'Marcos Benítez',
        'horarios' => [
            ['dia' => 'Lunes', 'empieza' => '18:00', 'termina' => '09:00'],
        ],
    ])->assertSessionHasErrors('horarios.0.termina');

    expect(Chofer::query()->count())->toBe(0);
});

test('guardar la ficha no borra los horarios', function () {
    $this->actingAs(User::factory()->create());

    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $chofer->horarios()->create([
        'dia' => 'Lunes',
        'empieza' => '09:00',
    ]);

    $this->put(route('drivers.update', $chofer), [
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => '1',
    ])->assertRedirect(route('drivers.index'));

    expect($chofer->horarios()->count())->toBe(1);
});

test('un visitante no puede cargar horarios', function () {
    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $this->post(route('drivers.horarios.store', $chofer), [
        'dia' => 'Lunes',
        'empieza' => '09:00',
    ])->assertRedirect(route('login'));
});

test('un admin carga corrige y borra un horario', function () {
    $this->actingAs(User::factory()->create());

    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $this->post(route('drivers.horarios.store', $chofer), [
        'dia' => 'Lunes a sábado',
        'empieza' => '09:00',
        'termina' => '18:00',
        // 'nota' => 'Con reserva',
    ])->assertRedirect(route('drivers.edit', $chofer));

    $horario = $chofer->horarios()->first();

    $this->get(route('drivers.edit', $chofer))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('chofer.horarios.0.dia', 'Lunes a sábado')
            ->where('chofer.horarios.0.empieza', '09:00')
            ->where('chofer.horarios.0.termina', '18:00'));
            // ->where('chofer.horarios.0.nota', 'Con reserva'));

    $this->put(route('drivers.horarios.update', [$chofer, $horario]), [
        'dia' => 'Domingo',
        'empieza' => '10:00',
        'termina' => '',
        // 'nota' => '',
    ])->assertRedirect(route('drivers.edit', $chofer));

    expect($horario->refresh()->dia)->toBe('Domingo')
        ->and($horario->termina)->toBeNull();
        // ->and($horario->nota)->toBeNull();

    $this->delete(route('drivers.horarios.destroy', [$chofer, $horario]))
        ->assertRedirect(route('drivers.edit', $chofer));

    expect($chofer->horarios()->count())->toBe(0);
});

test('la hora de fin no puede ser anterior a la de inicio', function () {
    $this->actingAs(User::factory()->create());

    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $this->post(route('drivers.horarios.store', $chofer), [
        'dia' => 'Lunes',
        'empieza' => '18:00',
        'termina' => '09:00',
    ])->assertSessionHasErrors('termina');
});

test('no se puede modificar el horario de otro chofer', function () {
    $this->actingAs(User::factory()->create());

    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $otro = Chofer::query()->create([
        'nombre' => 'Ana Ruiz',
        'slug' => 'ana-ruiz',
        'activo' => true,
    ]);

    $horario = $otro->horarios()->create([
        'dia' => 'Lunes',
        'empieza' => '09:00',
    ]);

    $this->put(route('drivers.horarios.update', [$chofer, $horario]), [
        'dia' => 'Martes',
        'empieza' => '11:00',
    ])->assertNotFound();

    $this->delete(route('drivers.horarios.destroy', [$chofer, $horario]))
        ->assertNotFound();
});
