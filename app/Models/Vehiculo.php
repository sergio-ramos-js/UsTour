<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['marca', 'modelo', 'anio', 'color', 'portaequipaje', 'capacidad_pasajeros', 'capacidad_baul'])]
class Vehiculo extends Model
{
    protected $table = 'vehiculos';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'anio' => 'integer',
            'portaequipaje' => 'boolean',
            'capacidad_pasajeros' => 'integer',
        ];
    }

    public function choferes(): HasMany
    {
        return $this->hasMany(Chofer::class);
    }
}
