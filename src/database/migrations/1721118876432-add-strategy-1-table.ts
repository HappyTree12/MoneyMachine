import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdxEmaSslTable1721118876432 implements MigrationInterface {
  name = 'AddAdxEmaSslTable1721118876432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "strategy-1" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "initiate_candles" integer NOT NULL, "interval" integer NOT NULL, "position_mode" integer NOT NULL, "margin" double precision NOT NULL, "first_tp_ratio" double precision, "tp_ratio" double precision NOT NULL, "sl_ratio" double precision NOT NULL, "use_ema" boolean NOT NULL, "use_adx" boolean NOT NULL, "use_ssl" boolean NOT NULL, "ema_length" integer NOT NULL, "smooth_period" integer NOT NULL, "di_length" integer NOT NULL, "adx_threshold" integer NOT NULL, "atr_mult" integer NOT NULL, "atr_len" integer NOT NULL, "atr_smoothing" character varying NOT NULL, "ssl1_smoothing" character varying NOT NULL, "ssl1_length" integer NOT NULL, "ssl2_smoothing" character varying NOT NULL, "ssl2_length" integer NOT NULL, "exit_smoothing" character varying NOT NULL, "exit_length" integer NOT NULL, "is_partial_mode" boolean NOT NULL DEFAULT false, "worker_id" uuid NOT NULL, CONSTRAINT "REL_5a4c9f9d55bb1520cef2caa21d" UNIQUE ("worker_id"), CONSTRAINT "PK_2ebc262de7ea6f90f9f204b806d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy-1" ADD CONSTRAINT "FK_5a4c9f9d55bb1520cef2caa21d3" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "strategy-1" DROP CONSTRAINT "FK_5a4c9f9d55bb1520cef2caa21d3"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" RENAME TO "bybit-sub-acc-worker_strategy_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "strategy-1"`);
  }
}
