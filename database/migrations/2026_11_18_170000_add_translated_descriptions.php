<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (['choferes', 'lugares'] as $tabla) {
            Schema::table($tabla, function (Blueprint $table) {
                $table->text('descripcion_en')->nullable();
                $table->text('descripcion_pt')->nullable();
                $table->text('descripcion_zh')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (['choferes', 'lugares'] as $tabla) {
            Schema::table($tabla, function (Blueprint $table) {
                $table->dropColumn(['descripcion_en', 'descripcion_pt', 'descripcion_zh']);
            });
        }
    }
};
