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
        ];
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $slug = trim((string) $this->input('slug', ''));

        $this->merge([
            'slug' => $slug === '' ? null : Str::slug($slug),
            'activo' => $this->boolean('activo'),
        ]);
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
            'foto' => ['nullable', 'image', 'max:4096'],
        ];
    }
}
