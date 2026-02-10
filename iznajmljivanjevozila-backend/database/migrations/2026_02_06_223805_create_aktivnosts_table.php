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
        Schema::create('aktivnosti', function (Blueprint $table) {
            $table->id();
            $table->foreignId('korisnikId')->nullable()->constrained('korisnici')->onDelete('set null');
            $table->string('akcija'); // npr. VEHICLE_CREATED
            $table->text('detalji')->nullable();
            $table->enum('tip', ['info', 'success', 'warning', 'error'])->default('info');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aktivnosts');
    }
};
