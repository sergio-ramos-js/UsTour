<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['chofer_id', 'dia', 'empieza', 'termina', 'nota'])]
class Horario extends Model
{
    protected $table = 'horarios';

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(Chofer::class);
    }
}
