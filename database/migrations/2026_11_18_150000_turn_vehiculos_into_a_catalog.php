<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->unsignedSmallInteger('anio')->nullable();
        });

        Schema::table('choferes', function (Blueprint $table) {
            $table->foreignId('vehiculo_id')->nullable()->constrained('vehiculos')->nullOnDelete();
        });

        DB::table('vehiculos')->orderBy('id')->lazy()->each(function (object $fila): void {
            if ($fila->chofer_id === null) {
                return;
            }

            DB::table('choferes')->where('id', $fila->chofer_id)->update([
                'vehiculo_id' => $fila->id,
            ]);
        });

        Schema::table('vehiculos', function (Blueprint $table) {
            $table->dropForeign(['chofer_id']);
            $table->dropUnique(['chofer_id']);
            $table->dropColumn('chofer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->foreignId('chofer_id')->nullable()->unique()->constrained('choferes')->cascadeOnDelete();
        });

        DB::table('choferes')->whereNotNull('vehiculo_id')->orderBy('id')->lazy()->each(function (object $fila): void {
            $ocupado = DB::table('vehiculos')->where('id', $fila->vehiculo_id)->value('chofer_id');

            if ($ocupado !== null) {
                return;
            }

            DB::table('vehiculos')->where('id', $fila->vehiculo_id)->update([
                'chofer_id' => $fila->id,
            ]);
        });

        Schema::table('choferes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('vehiculo_id');
        });

        Schema::table('vehiculos', function (Blueprint $table) {
            $table->dropColumn('anio');
        });
    }
};
