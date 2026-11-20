<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LugarRequest;
use App\Models\Lugar;
use App\Models\LugarFoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LugarController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/lugares/index', [
            'lugares' => Lugar::query()
                ->with('fotos')
                ->orderBy('ciudad')
                ->orderBy('nombre')
                ->get()
                ->map(fn (Lugar $lugar) => [
                    'id' => $lugar->id,
                    'nombre' => $lugar->nombre,
                    'ciudad' => $lugar->ciudad,
                    'foto_url' => $this->url($lugar->fotos->first()),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/lugares/form', [
            'lugar' => null,
        ]);
    }

    public function store(LugarRequest $request): RedirectResponse
    {
        $lugar = Lugar::query()->create($request->safe()->only($this->campos()));
        $this->guardarFotos($lugar, $request);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Lugar guardado correctamente.',
        ]);

        return redirect()->route('lugares.index');
    }

    public function edit(Lugar $lugar): Response
    {
        $lugar->load('fotos');

        return Inertia::render('admin/lugares/form', [
            'lugar' => [
                'id' => $lugar->id,
                'nombre' => $lugar->nombre,
                'descripcion' => $lugar->descripcion,
                'descripcion_en' => $lugar->descripcion_en,
                'descripcion_pt' => $lugar->descripcion_pt,
                'descripcion_zh' => $lugar->descripcion_zh,
                'ciudad' => $lugar->ciudad,
                'fotos' => $lugar->fotos->map(fn (LugarFoto $foto) => [
                    'id' => $foto->id,
                    'url' => Storage::disk('public')->url($foto->archivo),
                ])->values()->all(),
            ],
        ]);
    }

    public function update(LugarRequest $request, Lugar $lugar): RedirectResponse
    {
        $lugar->update($request->safe()->only($this->campos()));
        $this->guardarFotos($lugar, $request);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Lugar guardado correctamente.',
        ]);

        return redirect()->route('lugares.index');
    }

    public function destroy(Lugar $lugar): RedirectResponse
    {
        $lugar->load('fotos');

        foreach ($lugar->fotos as $foto) {
            Storage::disk('public')->delete($foto->archivo);
        }

        $lugar->delete();

        return redirect()->route('lugares.index');
    }

    public function destroyFoto(Lugar $lugar, LugarFoto $foto): RedirectResponse
    {
        Storage::disk('public')->delete($foto->archivo);
        $foto->delete();

        return redirect()->route('lugares.edit', $lugar);
    }

    private function guardarFotos(Lugar $lugar, LugarRequest $request): void
    {
        $orden = (int) $lugar->fotos()->max('orden');

        foreach ($request->file('fotos', []) as $archivo) {
            $orden++;
            $lugar->fotos()->create([
                'archivo' => $archivo->store('lugares', 'public'),
                'orden' => $orden,
            ]);
        }
    }

    /**
     * @return list<string>
     */
    private function campos(): array
    {
        return [
            'nombre',
            'descripcion',
            'descripcion_en',
            'descripcion_pt',
            'descripcion_zh',
            'ciudad',
        ];
    }

    private function url(?LugarFoto $foto): ?string
    {
        return $foto ? Storage::disk('public')->url($foto->archivo) : null;
    }
}
