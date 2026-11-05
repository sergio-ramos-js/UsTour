<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['chofer_id', 'marca', 'modelo', 'color', 'portaequipaje', 'capacidad_pasajeros', 'capacidad_baul'])]
class Vehiculo extends Model
{
    protected $table = 'vehiculos';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'portaequipaje' => 'boolean',
            'capacidad_pasajeros' => 'integer',
        ];
    }

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(Chofer::class);
    }
}
