<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetPostgresSequences extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset-postgres-sequences';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset PostgreSQL sequences to match the maximum ID values in their respective tables.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $tables = DB::select("
        SELECT c.relname as table_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'r'
        AND n.nspname = 'public'
    ");

        foreach ($tables as $table) {
            $tableName = $table->table_name;
            $hasId = DB::select("
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = ?
            AND column_name = 'id'
            AND data_type IN ('integer', 'bigint', 'smallint')
        ", [$tableName]);

            if (empty($hasId))
                continue;

            $sequence = DB::selectOne(
                "SELECT pg_get_serial_sequence(?, 'id') as seq",
                [$tableName]
            );

            if (!$sequence->seq)
                continue;

            $max = DB::selectOne("SELECT COALESCE(MAX(id), 0) + 1 as next FROM \"{$tableName}\"");
            DB::statement("SELECT setval('{$sequence->seq}', {$max->next})");
            $this->info("Reset sequence for {$tableName} → {$max->next}");
        }

        $telescopeMax = DB::selectOne(
            "SELECT COALESCE(MAX(sequence), 0) + 1 as next FROM telescope_entries"
        );
        DB::statement("SELECT setval('telescope_entries_sequence_seq', {$telescopeMax->next})");
        $this->info("Reset sequence for telescope_entries (sequence) → {$telescopeMax->next}");

        $this->info('All sequences reset successfully.');
    }
}
