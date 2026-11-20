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
            'descripcion' => $this->textoOpcional('descripcion'),
            'descripcion_en' => $this->textoOpcional('descripcion_en'),
            'descripcion_pt' => $this->textoOpcional('descripcion_pt'),
            'descripcion_zh' => $this->textoOpcional('descripcion_zh'),
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
            'descripcion_en' => ['nullable', 'string', 'max:2000'],
            'descripcion_pt' => ['nullable', 'string', 'max:2000'],
            'descripcion_zh' => ['nullable', 'string', 'max:2000'],
            'ciudad' => ['required', 'string', 'max:255'],
            'fotos' => ['nullable', 'array'],
            'fotos.*' => ['image', 'max:4096'],
        ];
    }

    private function textoOpcional(string $campo): ?string
    {
        $texto = trim((string) $this->input($campo, ''));

        return $texto === '' ? null : $texto;
    }
}
