<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombre',
     'slug',
     'descripcion',
     'foto',
     'telefono',
     'telefono_secundario',
     'correo',
     'activo',
     'fondo',
     'vehiculo_id'])]
     
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

    public function lugares(): BelongsToMany
    {
        return $this->belongsToMany(Lugar::class, 'chofer_lugar')
            ->withPivot('orden')
            ->withTimestamps()
            ->orderByPivot('orden')
            ->orderBy('nombre');
    }

    public function horarios(): HasMany
    {
        return $this->hasMany(Horario::class)->orderBy('empieza');
    }

    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class);
    }
}
