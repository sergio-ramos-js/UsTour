<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['chofer_id', 'nombre', 'descripcion', 'orden'])]
class Lugar extends Model
{
    protected $table = 'lugares';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'orden' => 'integer',
        ];
    }

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(Chofer::class);
    }
}
