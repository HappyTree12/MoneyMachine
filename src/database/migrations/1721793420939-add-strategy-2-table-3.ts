import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStrategy2Table31721793420939 implements MigrationInterface {
    name = 'AddStrategy2Table31721793420939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strategy-1" DROP CONSTRAINT "FK_5a4c9f9d55bb1520cef2caa21d3"`);
        await queryRunner.query(`CREATE TABLE "strategy-2" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "initiate_candles" integer NOT NULL, "interval" integer NOT NULL, "position_mode" integer NOT NULL, "margin" double precision NOT NULL, "first_tp_ratio" double precision, "tp_ratio" double precision NOT NULL, "sl_ratio" double precision NOT NULL, "is_partial_mode" boolean NOT NULL DEFAULT false, "use_ema1" boolean NOT NULL, "use_ema2" boolean NOT NULL, "use_adx" boolean NOT NULL, "use_hvol" boolean NOT NULL, "ema_length1" integer NOT NULL, "ema_length2" integer NOT NULL, "smooth_period" integer NOT NULL, "di_length" integer NOT NULL, "adx_threshold" integer NOT NULL, "mean_length" integer NOT NULL, "std_length" integer NOT NULL, "threshold_extra_high" double precision NOT NULL, "threshold_high" double precision NOT NULL, "threshold_medium" double precision NOT NULL, "threshold_normal" double precision NOT NULL, "worker_id" uuid NOT NULL, CONSTRAINT "REL_57722a4d68b7d636e4b2c120c6" UNIQUE ("worker_id"), CONSTRAINT "PK_eeb832caa06731f4717502d9a96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1', 'strategy_2')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "strategy-1" ADD CONSTRAINT "FK_b30b3aa50255b327d5697a74301" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "strategy-2" ADD CONSTRAINT "FK_57722a4d68b7d636e4b2c120c67" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strategy-2" DROP CONSTRAINT "FK_57722a4d68b7d636e4b2c120c67"`);
        await queryRunner.query(`ALTER TABLE "strategy-1" DROP CONSTRAINT "FK_b30b3aa50255b327d5697a74301"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" RENAME TO "bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TABLE "strategy-2"`);
        await queryRunner.query(`ALTER TABLE "strategy-1" ADD CONSTRAINT "FK_5a4c9f9d55bb1520cef2caa21d3" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
