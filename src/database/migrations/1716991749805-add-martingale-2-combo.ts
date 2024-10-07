import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMartingale2Combo1716991749805 implements MigrationInterface {
    name = 'AddMartingale2Combo1716991749805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."martingale-2-combo_enter_by_enum" AS ENUM('price', 'percentage')`);
        await queryRunner.query(`CREATE TABLE "martingale-2-combo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "enter_by" "public"."martingale-2-combo_enter_by_enum" NOT NULL, "order_by" character varying NOT NULL, "entries_differences" integer NOT NULL, "activation_percentage" double precision NOT NULL, "retracement_percentage" double precision NOT NULL, "long_entry" double precision array NOT NULL, "long_order" double precision array NOT NULL, "short_entry" double precision array NOT NULL, "short_order" double precision array NOT NULL, "worker_id" uuid NOT NULL, CONSTRAINT "REL_28ae415f8f44a904829535b0ca" UNIQUE ("worker_id"), CONSTRAINT "PK_123b3b1fc739b30c8f6e3e35aa4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_2', 'martingale_2_combo')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "initial_capital" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" ADD CONSTRAINT "FK_28ae415f8f44a904829535b0caa" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" DROP CONSTRAINT "FK_28ae415f8f44a904829535b0caa"`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "initial_capital" SET DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_2')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" RENAME TO "bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TABLE "martingale-2-combo"`);
        await queryRunner.query(`DROP TYPE "public"."martingale-2-combo_enter_by_enum"`);
    }

}
