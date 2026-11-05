<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ChoferRequest;
use App\Models\Chofer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ChoferController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/drivers/index', [
            'choferes' => Chofer::query()
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'slug', 'telefono', 'activo']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/drivers/form', [
            'chofer' => null,
        ]);
    }

    public function store(ChoferRequest $request): RedirectResponse
    {
        $chofer = Chofer::query()->create($this->attributes($request));

        return redirect()->route('drivers.edit', $chofer);
    }

    public function edit(Chofer $chofer): Response
    {
        return Inertia::render('admin/drivers/form', [
            'chofer' => [
                'nombre' => $chofer->nombre,
                'slug' => $chofer->slug,
                'descripcion' => $chofer->descripcion,
                'telefono' => $chofer->telefono,
                'telefono_secundario' => $chofer->telefono_secundario,
                'correo' => $chofer->correo,
                'activo' => $chofer->activo,
                'foto_url' => $chofer->foto ? Storage::disk('public')->url($chofer->foto) : null,
            ],
        ]);
    }

    public function update(ChoferRequest $request, Chofer $chofer): RedirectResponse
    {
        $chofer->update($this->attributes($request, $chofer));

        return redirect()->route('drivers.edit', $chofer);
    }

    public function destroy(Chofer $chofer): RedirectResponse
    {
        if ($chofer->foto) {
            Storage::disk('public')->delete($chofer->foto);
        }

        $chofer->delete();

        return redirect()->route('drivers.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function attributes(ChoferRequest $request, ?Chofer $chofer = null): array
    {
        $data = $request->safe()->except('foto');
        $data['slug'] = $data['slug'] ?: $this->uniqueSlug($data['nombre'], $chofer);

        if ($request->hasFile('foto')) {
            if ($chofer?->foto) {
                Storage::disk('public')->delete($chofer->foto);
            }

            $data['foto'] = $request->file('foto')->store('choferes', 'public');
        }

        return $data;
    }

    private function uniqueSlug(string $nombre, ?Chofer $ignore = null): string
    {
        $base = Str::slug($nombre);
        $base = $base !== '' ? $base : 'chofer';
        $slug = $base;
        $suffix = 2;

        while ($this->slugTaken($slug, $ignore)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function slugTaken(string $slug, ?Chofer $ignore = null): bool
    {
        if (in_array($slug, ChoferRequest::reservedSlugs(), true)) {
            return true;
        }

        return Chofer::query()
            ->when($ignore, fn ($query) => $query->whereKeyNot($ignore->id))
            ->where('slug', $slug)
            ->exists();
    }
}
