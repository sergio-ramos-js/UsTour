<?php

use App\Models\Chofer;
use App\Models\User;
use App\Models\Vehiculo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests cannot open the driver list', function () {
    $this->get(route('drivers.index'))->assertRedirect(route('login'));
});

test('authenticated users can open the driver list', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('drivers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/drivers/index'));
});

test('la lista muestra nombre, slug, vehiculo, telefono y estado', function () {
    $this->actingAs(User::factory()->create());

    $vehiculo = Vehiculo::query()->create([
        'marca' => 'Toyota',
        'modelo' => 'Hiace',
        'anio' => 2019,
        'color' => 'Blanco',
        'portaequipaje' => true,
        'capacidad_pasajeros' => 8,
    ]);

    Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'telefono' => '2901555000',
        'correo' => 'marcos@example.com',
        'activo' => true,
        'vehiculo_id' => $vehiculo->id,
    ]);

    $this->get(route('drivers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/drivers/index')
            ->where('busqueda', '')
            ->where('choferes.data.0.nombre', 'Marcos Benítez')
            ->where('choferes.data.0.slug', 'marcos-benitez')
            ->where('choferes.data.0.telefono', '2901555000')
            ->where('choferes.data.0.correo', 'marcos@example.com')
            ->where('choferes.data.0.activo', true)
            ->where('choferes.data.0.vehiculo', 'Toyota Hiace 2019 Blanco'));
});

test('la lista busca por nombre slug o telefono y pagina de a 20', function () {
    $this->actingAs(User::factory()->create());

    Chofer::query()->create([
        'nombre' => 'Ana Ruiz',
        'slug' => 'ana-ruiz',
        'telefono' => '2901999888',
        'activo' => true,
    ]);

    for ($numero = 1; $numero <= 20; $numero++) {
        Chofer::query()->create([
            'nombre' => sprintf('Chofer %02d', $numero),
            'slug' => 'chofer-'.$numero,
            'telefono' => '29010000'.$numero,
            'activo' => true,
        ]);
    }

    $this->get(route('drivers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('choferes.per_page', 20)
            ->where('choferes.total', 21)
            ->where('choferes.last_page', 2)
            ->has('choferes.data', 20));

    $this->get(route('drivers.index', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('choferes.current_page', 2)
            ->has('choferes.data', 1));

    $this->get(route('drivers.index', ['q' => '2901999888']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('busqueda', '2901999888')
            ->where('choferes.total', 1)
            ->where('choferes.data.0.slug', 'ana-ruiz'));

    $this->get(route('drivers.index', ['q' => 'ana-ruiz']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('choferes.data.0.nombre', 'Ana Ruiz'));
});

test('an admin can create a driver and the slug comes from the name', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->post(route('drivers.store'), [
        'nombre' => 'Marcos Benítez',
        'telefono' => '2901555000',
        'activo' => '1',
    ]);

    $chofer = Chofer::query()->first();

    $response->assertRedirect(route('drivers.index'))
        ->assertInertiaFlash('toast', [
            'type' => 'success',
            'message' => 'Chofer guardado correctamente.',
        ]);

    expect($chofer->slug)->toBe('marcos-benitez')
        ->and($chofer->activo)->toBeTrue();
});

test('an admin can deactivate and delete a driver', function () {
    $this->actingAs(User::factory()->create());

    $chofer = Chofer::query()->create([
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
        'activo' => true,
    ]);

    $this->put(route('drivers.update', $chofer), [
        'nombre' => 'Marcos Benítez',
        'slug' => 'marcos-benitez',
    ])->assertRedirect(route('drivers.index'))
        ->assertInertiaFlash('toast', [
            'type' => 'success',
            'message' => 'Cambios guardados correctamente.',
        ]);

    expect($chofer->refresh()->activo)->toBeFalse();

    $this->delete(route('drivers.destroy', $chofer))
        ->assertRedirect(route('drivers.index'));

    expect(Chofer::query()->count())->toBe(0);
});

test('an admin can upload a driver photo', function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());

    $this->post(route('drivers.store'), [
        'nombre' => 'Marcos Benítez',
        'foto' => UploadedFile::fake()->image('chofer.jpg'),
    ])->assertRedirect();

    $chofer = Chofer::query()->first();

    expect($chofer->foto)->not->toBeNull();
    Storage::disk('public')->assertExists($chofer->foto);
});
