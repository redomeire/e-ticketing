<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->boolean('is_male');
            $table->foreignId('seat_id')
                ->constrained('event_seats')
                ->onDelete('cascade');
            $table->foreignId('order_id')
                ->constrained()
                ->onDelete('cascade');
            $table->timestamps();
            $table->softDeletesTz('deleted_at', 0);
            $table->unique(['email', 'order_id']);
        });
        // prevent multiple attendees from being assigned to the same seat, but allow it if the attendee is soft deleted
        if (config('database.default') === 'pgsql') {
            DB::statement('CREATE UNIQUE INDEX attendees_seat_id_unique_active ON attendees (seat_id) WHERE deleted_at IS NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (config('database.default') === 'pgsql') {
            DB::statement('DROP INDEX IF EXISTS attendees_seat_id_unique_active');
        }
        Schema::dropIfExists('attendees');
    }
};
