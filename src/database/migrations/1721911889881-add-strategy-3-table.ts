import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStrategy3Table1721911889881 implements MigrationInterface {
    name = 'AddStrategy3Table1721911889881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "strategy-3" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "initiate_candles" integer NOT NULL, "interval" integer NOT NULL, "position_mode" integer NOT NULL, "margin" double precision NOT NULL, "first_tp_ratio" double precision, "tp_ratio" double precision NOT NULL, "sl_ratio" double precision NOT NULL, "is_partial_mode" boolean NOT NULL DEFAULT false, "use_ema" boolean NOT NULL, "use_macd" boolean NOT NULL, "ema_length" integer NOT NULL, "ema_candlestick_count" integer NOT NULL, "macd_threshold" integer NOT NULL, "worker_id" uuid NOT NULL, "workerId" uuid, CONSTRAINT "REL_527a05c783c23faa87ab8e08eb" UNIQUE ("workerId"), CONSTRAINT "PK_65d953ec430d04ed99ccb2a4eca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1', 'strategy_2', 'strategy_3')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "strategy-3" ADD CONSTRAINT "FK_527a05c783c23faa87ab8e08ebf" FOREIGN KEY ("workerId") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strategy-3" DROP CONSTRAINT "FK_527a05c783c23faa87ab8e08ebf"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1', 'strategy_2')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" RENAME TO "bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TABLE "strategy-3"`);
    }

}
