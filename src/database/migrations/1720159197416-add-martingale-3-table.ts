import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMartingale3Table1720159197416 implements MigrationInterface {
    name = 'AddMartingale3Table1720159197416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "martingale-3" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_by" character varying NOT NULL, "orders" double precision array NOT NULL, "take_profit_percentage" double precision NOT NULL, "throttle_percentage" double precision NOT NULL, "worker_id" uuid NOT NULL, CONSTRAINT "REL_4adeb8f0e65e9b51f8f063be26" UNIQUE ("worker_id"), CONSTRAINT "PK_ee82d71b2e6f225b984e70f7718" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "martingale-3" ADD CONSTRAINT "FK_4adeb8f0e65e9b51f8f063be260" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "martingale-3" DROP CONSTRAINT "FK_4adeb8f0e65e9b51f8f063be260"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_2', 'martingale_1', 'martingale_2_combo', 'martingale_1_combo')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" RENAME TO "bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TABLE "martingale-3"`);
    }

}
