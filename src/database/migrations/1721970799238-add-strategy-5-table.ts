import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStrategy5Table1721970799238 implements MigrationInterface {
    name = 'AddStrategy5Table1721970799238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "strategy-5" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "initiate_candles" integer NOT NULL, "interval" integer NOT NULL, "position_mode" integer NOT NULL, "margin" double precision NOT NULL, "first_tp_ratio" double precision, "tp_ratio" double precision NOT NULL, "sl_ratio" double precision NOT NULL, "is_partial_mode" boolean NOT NULL DEFAULT false, "use_ema1" boolean NOT NULL, "use_ema2" boolean NOT NULL, "use_adx" boolean NOT NULL, "use_rsi" boolean NOT NULL, "use_atr" boolean NOT NULL, "ema_length1" integer NOT NULL, "ema_length2" integer NOT NULL, "smooth_period" integer NOT NULL, "di_length" integer NOT NULL, "adx_threshold" integer NOT NULL, "rsi_length" integer NOT NULL, "rsi_buy_threshold" integer NOT NULL, "rsi_sell_threshold" integer NOT NULL, "worker_id" uuid NOT NULL, CONSTRAINT "REL_b3294045519f441d410d8d83f9" UNIQUE ("worker_id"), CONSTRAINT "PK_9c21656c12ec53264d4eb4c81d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1', 'strategy_2', 'strategy_3', 'strategy_5')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "strategy-5" ADD CONSTRAINT "FK_b3294045519f441d410d8d83f98" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strategy-5" DROP CONSTRAINT "FK_b3294045519f441d410d8d83f98"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1', 'strategy_2', 'strategy_3')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" RENAME TO "bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TABLE "strategy-5"`);
    }

}
