<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique()->after('name');
            $table->text('description')->nullable();
            $table->text('terms_and_conditions')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->softDeletesTz('deleted_at', precision: 0);
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('location');
            $table->integer('max_row_index');
            $table->integer('max_column_index');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
