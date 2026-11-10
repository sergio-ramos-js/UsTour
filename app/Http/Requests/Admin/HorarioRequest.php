<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class HorarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $nota = trim((string) $this->input('nota', ''));

        $this->merge([
            'dia' => trim((string) $this->input('dia', '')),
            'termina' => $this->filled('termina') ? $this->input('termina') : null,
            'nota' => $nota === '' ? null : $nota,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'dia' => ['required', 'string', 'max:255'],
            'empieza' => ['required', 'date_format:H:i'],
            'termina' => ['nullable', 'date_format:H:i', 'after:empieza'],
            'nota' => ['nullable', 'string', 'max:255'],
        ];
    }
}