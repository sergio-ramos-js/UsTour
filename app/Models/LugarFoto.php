<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['lugar_id', 'archivo', 'orden'])]
class LugarFoto extends Model
{
    protected $table = 'lugar_fotos';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'orden' => 'integer',
        ];
    }

    public function lugar(): BelongsTo
    {
        return $this->belongsTo(Lugar::class);
    }
}
