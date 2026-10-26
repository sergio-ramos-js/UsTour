<?php

use App\Models\User;

test('guests cannot open the driver list', function () {
    $this->get(route('drivers.index'))->assertRedirect(route('login'));
});

test('authenticated users can open the driver list', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('drivers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/drivers/index'));
});
