<?php

test('a visitor can open a driver page without logging in', function () {
    $this->get(route('drivers.show', ['slug' => 'juan-perez']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/drivers/show')
            ->where('slug', 'juan-perez'));
});

test('reserved addresses are not treated as a driver slug', function () {
    $this->get('/login')->assertOk();
    $this->get('/drivers')->assertRedirect(route('login'));
});
