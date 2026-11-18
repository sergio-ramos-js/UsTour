<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Lugares become a shared catalog. Each driver keeps an ordered selection.
     */
    public function up(): void
    {
        Schema::create('chofer_lugar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chofer_id')->constrained('choferes')->cascadeOnDelete();
            $table->foreignId('lugar_id')->constrained('lugares')->cascadeOnDelete();
            $table->unsignedInteger('orden')->default(0);
            $table->timestamps();
            $table->unique(['chofer_id', 'lugar_id']);
        });

        DB::table('lugares')->orderBy('id')->lazy()->each(function (object $fila): void {
            DB::table('chofer_lugar')->insert([
                'chofer_id' => $fila->chofer_id,
                'lugar_id' => $fila->id,
                'orden' => $fila->orden,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        Schema::table('lugares', function (Blueprint $table) {
            $table->dropConstrainedForeignId('chofer_id');
            $table->dropColumn('orden');
            $table->string('ciudad')->default('Ushuaia');
        });

        Schema::create('lugar_fotos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lugar_id')->constrained('lugares')->cascadeOnDelete();
            $table->string('archivo');
            $table->unsignedInteger('orden')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the catalog split.
     */
    public function down(): void
    {
        Schema::dropIfExists('lugar_fotos');

        Schema::table('lugares', function (Blueprint $table) {
            $table->dropColumn('ciudad');
            $table->foreignId('chofer_id')->nullable()->constrained('choferes')->cascadeOnDelete();
            $table->unsignedInteger('orden')->default(0);
        });

        DB::table('chofer_lugar')->orderBy('id')->lazy()->each(function (object $fila): void {
            DB::table('lugares')->where('id', $fila->lugar_id)->update([
                'chofer_id' => $fila->chofer_id,
                'orden' => $fila->orden,
            ]);
        });

        Schema::dropIfExists('chofer_lugar');
    }
};
