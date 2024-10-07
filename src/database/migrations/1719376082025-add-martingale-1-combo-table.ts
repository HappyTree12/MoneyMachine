import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMartingale1ComboTable1719376082025
  implements MigrationInterface
{
  name = 'AddMartingale1ComboTable1719376082025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."martingale-1-combo_enter_by_enum" AS ENUM('price', 'percentage')`,
    );
    await queryRunner.query(
      `CREATE TABLE "martingale-1-combo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "enter_by" "public"."martingale-1-combo_enter_by_enum" NOT NULL, "order_by" character varying NOT NULL, "activation_percentage" double precision array NOT NULL DEFAULT '{}', "retracement_percentage" double precision array NOT NULL DEFAULT '{}', "long_entry" double precision array NOT NULL, "long_order" double precision array NOT NULL, "short_entry" double precision array NOT NULL, "short_order" double precision array NOT NULL, "worker_id" uuid NOT NULL, CONSTRAINT "REL_93344c3a14cc116b8e6435bbd8" UNIQUE ("worker_id"), CONSTRAINT "PK_cdc9df5a99382dced4f1547d48e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" RENAME TO "bybit-sub-acc-worker_strategy_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_2', 'martingale_1', 'martingale_2_combo', 'martingale_1_combo')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "strategy_type" TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" USING "strategy_type"::"text"::"public"."bybit-sub-acc-worker_strategy_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "martingale-1-combo" ADD CONSTRAINT "FK_93344c3a14cc116b8e6435bbd86" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "martingale-1-combo" DROP CONSTRAINT "FK_93344c3a14cc116b8e6435bbd86"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum_old" AS ENUM('martingale_2', 'martingale_1', 'martingale_2_combo')`,
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
    await queryRunner.query(`DROP TABLE "martingale-1-combo"`);
    await queryRunner.query(
      `DROP TYPE "public"."martingale-1-combo_enter_by_enum"`,
    );
  }
}
