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
        Schema::create('event_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_category_id')
                ->constrained('event_ticket_categories')
                ->onDelete('cascade');
            $table->string('seat_number', 4);
            $table->integer('row_index');
            $table->integer('column_index');
            $table->boolean('is_available')->default(true);
            $table->timestamp('locked_until')->nullable();
            $table->softDeletesTz('deleted_at', precision: 0);
            $table->timestamps();
            $table->unique(['ticket_category_id', 'row_index', 'column_index'], 'unique_seat_position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_seats');
    }
};
