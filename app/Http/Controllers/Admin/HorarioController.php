<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HorarioRequest;
use App\Models\Chofer;
use App\Models\Horario;
use Illuminate\Http\RedirectResponse;

class HorarioController extends Controller
{
    public function store(HorarioRequest $request, Chofer $chofer): RedirectResponse
    {
        $chofer->horarios()->create($request->validated());

        return redirect()->route('drivers.edit', $chofer);
    }

    public function update(HorarioRequest $request, Chofer $chofer, Horario $horario): RedirectResponse
    {
        $horario->update($request->validated());

        return redirect()->route('drivers.edit', $chofer);
    }

    public function destroy(Chofer $chofer, Horario $horario): RedirectResponse
    {
        $horario->delete();

        return redirect()->route('drivers.edit', $chofer);
    }
}