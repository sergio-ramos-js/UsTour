<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class VehiculoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $color = trim((string) $this->input('color', ''));
        $baul = trim((string) $this->input('capacidad_baul', ''));

        $this->merge([
            'marca' => trim((string) $this->input('marca', '')),
            'modelo' => trim((string) $this->input('modelo', '')),
            'color' => $color === '' ? null : $color,
            'capacidad_baul' => $baul === '' ? null : $baul,
            'portaequipaje' => $this->boolean('portaequipaje'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'marca' => ['required', 'string', 'max:255'],
            'modelo' => ['required', 'string', 'max:255'],
            'anio' => ['required', 'integer', 'min:1950', 'max:'.((int) date('Y') + 1)],
            'color' => ['nullable', 'string', 'max:255'],
            'portaequipaje' => ['boolean'],
            'capacidad_pasajeros' => ['required', 'integer', 'min:1', 'max:60'],
            'capacidad_baul' => ['nullable', 'string', 'max:255'],
        ];
    }
}
