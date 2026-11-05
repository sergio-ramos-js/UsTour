<?php

use App\Models\Chofer;
use App\Models\User;
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

test('an admin can create a driver and the slug comes from the name', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->post(route('drivers.store'), [
        'nombre' => 'Marcos Benítez',
        'telefono' => '2901555000',
        'activo' => '1',
    ]);

    $chofer = Chofer::query()->first();

    $response->assertRedirect(route('drivers.edit', $chofer));

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
    ])->assertRedirect(route('drivers.edit', $chofer));

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
