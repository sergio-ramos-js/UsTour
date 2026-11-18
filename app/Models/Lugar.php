<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombre', 'descripcion', 'ciudad'])]
class Lugar extends Model
{
    protected $table = 'lugares';

    public function fotos(): HasMany
    {
        return $this->hasMany(LugarFoto::class)->orderBy('orden');
    }

    public function choferes(): BelongsToMany
    {
        return $this->belongsToMany(Chofer::class, 'chofer_lugar')
            ->withPivot('orden')
            ->withTimestamps();
    }
}
