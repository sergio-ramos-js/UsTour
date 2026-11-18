<?php

namespace App\Http\Requests\Admin;

use App\Models\Chofer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ChoferRequest extends FormRequest
{
    /**
     * Slugs that already belong to other pages of the site.
     *
     * @return list<string>
     */
    public static function reservedSlugs(): array
    {
        return [
            'login',
            'logout',
            'register',
            'forgot-password',
            'reset-password',
            'two-factor-challenge',
            'dashboard',
            'settings',
            'drivers',
            'up',
            'create',
            'edit',
            'lugares',
            'vehiculos',
        ];
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $slug = trim((string) $this->input('slug', ''));
        $data = [
            'slug' => $slug === '' ? null : Str::slug($slug),
            'activo' => $this->boolean('activo'),
            'fondo' => in_array($this->input('fondo'), ['masculino', 'femenino'], true)
                ? $this->input('fondo')
                : 'masculino',
        ];

        if ($this->route('chofer') === null) {
            $data['horarios'] = $this->horariosParaGuardar();
        }

        $data['lugares'] = $this->lugaresElegidos();
        $data['vehiculo_id'] = filled($this->input('vehiculo_id')) ? (int) $this->input('vehiculo_id') : null;

        $this->merge($data);
    }

    /**
     * Drop blank rows. A row with any value is validated.
     *
     * @return list<array{dia: string, empieza: ?string, termina: ?string}>|null
     */
    private function horariosParaGuardar(): ?array
    {
        $filas = collect($this->input('horarios', []))
            ->filter(function ($fila) {
                if (! is_array($fila)) {
                    return false;
                }

                return collect([
                    'dia',
                    'empieza',
                    'termina',
                    // 'nota',
                ])->contains(fn (string $campo) => filled($fila[$campo] ?? null));
            })
            ->map(function (array $fila) {
                // $nota = trim((string) ($fila['nota'] ?? ''));

                return [
                    'dia' => trim((string) ($fila['dia'] ?? '')),
                    'empieza' => filled($fila['empieza'] ?? null) ? $fila['empieza'] : null,
                    'termina' => filled($fila['termina'] ?? null) ? $fila['termina'] : null,
                    // 'nota' => $nota === '' ? null : $nota,
                ];
            })
            ->values()
            ->all();

        return $filas === [] ? null : $filas;
    }

    /**
     * Keep only the places the admin checked.
     *
     * @return list<array{id: int, orden: int}>|null
     */
    private function lugaresElegidos(): ?array
    {
        $filas = collect($this->input('lugares', []))
            ->filter(fn ($fila) => is_array($fila) && filter_var($fila['elegido'] ?? false, FILTER_VALIDATE_BOOLEAN))
            ->map(fn (array $fila) => [
                'id' => (int) $fila['id'],
                'orden' => filled($fila['orden'] ?? null) ? (int) $fila['orden'] : 0,
            ])
            ->values()
            ->all();

        return $filas === [] ? null : $filas;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Chofer|null $chofer */
        $chofer = $this->route('chofer');

        return [
            'nombre' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::notIn(self::reservedSlugs()),
                Rule::unique('choferes', 'slug')->ignore($chofer),
            ],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'telefono_secundario' => ['nullable', 'string', 'max:30'],
            'correo' => ['nullable', 'email', 'max:255'],
            'activo' => ['boolean'],
            'fondo' => ['required', 'in:masculino,femenino'],
            'foto' => ['nullable', 'image', 'max:4096'],
            'lugares' => ['nullable', 'array'],
            'lugares.*.id' => ['required', 'integer', 'exists:lugares,id'],
            'lugares.*.orden' => ['integer', 'min:0'],
            'vehiculo_id' => ['nullable', 'integer', 'exists:vehiculos,id'],
        ] + ($chofer === null ? [
            'horarios' => ['nullable', 'array'],
            'horarios.*.dia' => ['required', 'string', 'max:255'],
            'horarios.*.empieza' => ['required', 'date_format:H:i'],
            'horarios.*.termina' => ['nullable', 'date_format:H:i', 'after:horarios.*.empieza'],
            // 'horarios.*.nota' => ['nullable', 'string', 'max:255'],
        ] : []);
    }
}
