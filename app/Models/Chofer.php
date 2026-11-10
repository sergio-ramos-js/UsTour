<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['nombre',
     'slug',
     'descripcion',
     'foto',
     'telefono',
     'telefono_secundario',
     'correo',
     'activo'])]
     
class Chofer extends Model
{
    protected $table = 'choferes';

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function lugares(): HasMany
    {
        return $this->hasMany(Lugar::class)->orderBy('orden');
    }

    public function horarios(): HasMany
    {
        return $this->hasMany(Horario::class)->orderBy('empieza');
    }

    public function vehiculo(): HasOne
    {
        return $this->hasOne(Vehiculo::class);
    }
}
