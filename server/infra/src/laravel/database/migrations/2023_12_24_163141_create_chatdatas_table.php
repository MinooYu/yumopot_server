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
        Schema::create('chatdatas', function (Blueprint $table) {
            $table->id();
			$table->string('chatUsername');
			$table->uuid('chatUserHash')->nullable();
			$table->foreign('chatUserHash')->references('userHash')->on('users');
			$table->string('roomid');
			$table->text('chattext');
			$table->string('color');
            $table->timestamp('creates_at')->useCurrent();
			$table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatdatas');
    }
};
