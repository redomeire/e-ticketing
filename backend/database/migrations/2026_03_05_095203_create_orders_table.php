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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('event_name');
            $table->string('event_location');
            $table->dateTime('event_start_time');
            $table->datetime('event_end_time');
            $table->string('invoice_id')->unique();
            $table->enum('status', ['pending', 'paid', 'expired', 'failed'])->default('pending');
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->text('payment_url')->nullable();
            $table->softDeletesTz('deleted_at', precision: 0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
