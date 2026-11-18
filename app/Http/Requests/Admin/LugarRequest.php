<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class LugarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $ciudad = trim((string) $this->input('ciudad', ''));

        $this->merge([
            'nombre' => trim((string) $this->input('nombre', '')),
            'ciudad' => $ciudad === '' ? 'Ushuaia' : $ciudad,
            'descripcion' => trim((string) $this->input('descripcion', '')) ?: null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'ciudad' => ['required', 'string', 'max:255'],
            'fotos' => ['nullable', 'array'],
            'fotos.*' => ['image', 'max:4096'],
        ];
    }
}
