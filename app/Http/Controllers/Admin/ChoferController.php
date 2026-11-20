<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ChoferRequest;
use App\Models\Chofer;
use App\Models\Lugar;
use App\Models\Vehiculo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Carbon;

class ChoferController extends Controller
{
    public function index(Request $request): Response
    {
        $busqueda = $request->string('q')->trim()->limit(100, '')->toString();

        $choferes = Chofer::query()
            ->with('vehiculo:id,marca,modelo,anio,color')
            ->when($busqueda !== '', function ($query) use ($busqueda) {
                $like = '%'.$busqueda.'%';

                $query->where(function ($query) use ($like) {
                    $query->where('nombre', 'like', $like)
                        ->orWhere('slug', 'like', $like)
                        ->orWhere('telefono', 'like', $like)
                        ->orWhere('correo', 'like', $like);
                });
            })
            ->orderBy('nombre')
            ->paginate(20, ['id', 'nombre', 'slug', 'telefono', 'correo', 'activo', 'vehiculo_id'])
            ->withQueryString()
            ->through(fn (Chofer $chofer) => [
                'id' => $chofer->id,
                'nombre' => $chofer->nombre,
                'slug' => $chofer->slug,
                'telefono' => $chofer->telefono,
                'correo' => $chofer->correo,
                'activo' => $chofer->activo,
                'vehiculo' => $this->textoVehiculo($chofer->vehiculo),
            ]);

        return Inertia::render('admin/drivers/index', [
            'choferes' => $choferes,
            'busqueda' => $busqueda,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/drivers/form', [
            'chofer' => null,
            'lugares' => $this->catalogo(),
            'vehiculos' => $this->vehiculos(),
        ]);
    }

    public function store(ChoferRequest $request): RedirectResponse
    {
        $chofer = Chofer::query()->create($this->attributes($request));

        foreach ($request->validated('horarios') ?? [] as $horario) {
            $chofer->horarios()->create($horario);
        }

        $this->syncLugares($chofer, $request);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Chofer guardado correctamente.',
        ]);

        return redirect()->route('drivers.index');
    }

    public function edit(Chofer $chofer): Response
    {
        $chofer->load('horarios', 'lugares');

        return Inertia::render('admin/drivers/form', [
            'chofer' => [
                'nombre' => $chofer->nombre,
                'slug' => $chofer->slug,
                'descripcion' => $chofer->descripcion,
                'descripcion_en' => $chofer->descripcion_en,
                'descripcion_pt' => $chofer->descripcion_pt,
                'descripcion_zh' => $chofer->descripcion_zh,
                'telefono' => $chofer->telefono,
                'telefono_secundario' => $chofer->telefono_secundario,
                'correo' => $chofer->correo,
                'activo' => $chofer->activo,
                'fondo' => $chofer->fondo,
                'vehiculo_id' => $chofer->vehiculo_id,
                'foto_url' => $chofer->foto ? Storage::disk('public')->url($chofer->foto) : null,
                'horarios' => $chofer->horarios->map(fn($horario) => [
                    'id' => $horario->id,
                    'dia' => $horario->dia,
                    'empieza' => $this->hora($horario->empieza),
                    'termina' => $this->hora($horario->termina),
                    // 'nota' => $horario->nota,
                ])->values()->all(),
            ],
            'lugares' => $this->catalogo($chofer),
            'vehiculos' => $this->vehiculos(),
        ]);
    }

    public function update(ChoferRequest $request, Chofer $chofer): RedirectResponse
    {
        $chofer->update($this->attributes($request, $chofer));
        $this->syncLugares($chofer, $request);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Cambios guardados correctamente.',
        ]);

        return redirect()->route('drivers.index');
    }

    public function destroy(Chofer $chofer): RedirectResponse
    {
        if ($chofer->foto) {
            Storage::disk('public')->delete($chofer->foto);
        }

        $chofer->delete();

        return redirect()->route('drivers.index');
    }

    private function textoVehiculo(?Vehiculo $vehiculo): ?string
    {
        if ($vehiculo === null) {
            return null;
        }

        return collect([$vehiculo->marca, $vehiculo->modelo, $vehiculo->anio, $vehiculo->color])
            ->filter()
            ->implode(' ');
    }

    /**
     * @return array<string, mixed>
     */
    private function attributes(ChoferRequest $request, ?Chofer $chofer = null): array
    {
        $data = $request->safe()->except(['foto', 'horarios', 'lugares']);
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
            $slug = $base . '-' . $suffix;
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
            ->when($ignore, fn($query) => $query->whereKeyNot($ignore->id))
            ->where('slug', $slug)
            ->exists();
    }

    /**
     * @return list<array{id: int, nombre: string, ciudad: string, elegido: bool, orden: int}>
     */
    private function catalogo(?Chofer $chofer = null): array
    {
        $elegidos = $chofer
            ? $chofer->lugares->mapWithKeys(fn (Lugar $lugar) => [$lugar->id => (int) $lugar->pivot->orden])
            : collect();

        return Lugar::query()
            ->orderBy('ciudad')
            ->orderBy('nombre')
            ->get()
            ->map(fn (Lugar $lugar) => [
                'id' => $lugar->id,
                'nombre' => $lugar->nombre,
                'ciudad' => $lugar->ciudad,
                'elegido' => $elegidos->has($lugar->id),
                'orden' => $elegidos->get($lugar->id, 0),
            ])
            ->all();
    }

    private function syncLugares(Chofer $chofer, ChoferRequest $request): void
    {
        $sync = [];

        foreach ($request->validated('lugares') ?? [] as $fila) {
            $sync[$fila['id']] = ['orden' => $fila['orden']];
        }

        $chofer->lugares()->sync($sync);
    }

    /**
     * @return list<array{id: int, marca: string, modelo: string, anio: int|null, color: string|null}>
     */
    private function vehiculos(): array
    {
        return Vehiculo::query()
            ->orderBy('marca')
            ->orderBy('modelo')
            ->orderBy('anio')
            ->get()
            ->map(fn (Vehiculo $vehiculo) => [
                'id' => $vehiculo->id,
                'marca' => $vehiculo->marca,
                'modelo' => $vehiculo->modelo,
                'anio' => $vehiculo->anio,
                'color' => $vehiculo->color,
            ])
            ->all();
    }

    private function hora(?string $valor): ?string
    {
        return $valor === null ? null : Carbon::parse($valor)->format('H:i');
    }
}
