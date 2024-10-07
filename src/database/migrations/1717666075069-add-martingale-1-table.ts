import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMartingale1Table1717666075069 implements MigrationInterface {
    name = 'AddMartingale1Table1717666075069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "martingale-1" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "enter_by" character varying NOT NULL, "order_by" character varying NOT NULL, "long_entry" double precision array NOT NULL, "long_order" double precision array NOT NULL, "short_entry" double precision array NOT NULL, "short_order" double precision array NOT NULL, "worker_id" uuid NOT NULL, "activation_percentage" double precision NOT NULL, "retracement_percentage" double precision NOT NULL, CONSTRAINT "REL_15feaa880a3f1b65642efabdef" UNIQUE ("worker_id"), CONSTRAINT "PK_8b834dbee51e1eefe2299ada5d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_2', 'martingale_1', 'martingale_2_combo')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "martingale-1" ADD CONSTRAINT "FK_15feaa880a3f1b65642efabdef8" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "martingale-1" DROP CONSTRAINT "FK_15feaa880a3f1b65642efabdef8"`);
        await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_2', 'martingale_2_combo')`);
        await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" RENAME TO "bybit-sub-acc-worker_strategy_type_enum"`);
        await queryRunner.query(`DROP TABLE "martingale-1"`);
    }

}
