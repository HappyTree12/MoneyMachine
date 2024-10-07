import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupOrders1715217198905 implements MigrationInterface {
  name = 'AddGroupOrders1715217198905'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "group-order-workers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "index" integer NOT NULL, "entry_price_percentage" double precision NOT NULL, "worker_id" uuid NOT NULL, "group_order_id" uuid NOT NULL, CONSTRAINT "PK_8cdc57fa453070d2d4965852157" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "group-order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "price_entry_diff_percentage" double precision NOT NULL, "initial_capital" double precision NOT NULL, "min_capital" double precision NOT NULL DEFAULT '0', "max_capital" double precision NOT NULL DEFAULT '0', "master_worker_id" uuid NOT NULL, CONSTRAINT "PK_992c607d10456cbd6be4be93db9" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "entry_price" double precision`);
    await queryRunner.query(`CREATE TYPE "public"."martingale-2_enter_by_enum" AS ENUM('price', 'percentage')`);
    await queryRunner.query(`ALTER TABLE "martingale-2" ALTER COLUMN "enter_by" TYPE "public"."martingale-2_enter_by_enum" USING "enter_by"::"text"::"public"."martingale-2_enter_by_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_worker_status_enum" RENAME TO "bybit-sub-acc-worker_worker_status_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_worker_status_enum" AS ENUM('submitted', 'waiting', 'running', 'completed', 'error', 'stopped')`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "worker_status" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "worker_status" TYPE "public"."bybit-sub-acc-worker_worker_status_enum" USING "worker_status"::"text"::"public"."bybit-sub-acc-worker_worker_status_enum"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "worker_status" SET DEFAULT 'submitted'`);
    await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_worker_status_enum_old"`);
    await queryRunner.query(`ALTER TABLE "group-order-workers" ADD CONSTRAINT "FK_fdb19b64d77c04630d1c717caa4" FOREIGN KEY ("group_order_id") REFERENCES "group-order"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "group-order-workers" ADD CONSTRAINT "FK_140eaf851341275d329676a4874" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "group-order" ADD CONSTRAINT "FK_8d91770aa1d487e33762608f07a" FOREIGN KEY ("master_worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group-order" DROP CONSTRAINT "FK_8d91770aa1d487e33762608f07a"`);
    await queryRunner.query(`ALTER TABLE "group-order-workers" DROP CONSTRAINT "FK_140eaf851341275d329676a4874"`);
    await queryRunner.query(`ALTER TABLE "group-order-workers" DROP CONSTRAINT "FK_fdb19b64d77c04630d1c717caa4"`);
    await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_worker_status_enum_old" AS ENUM('submitted', 'running', 'completed', 'error', 'stopped')`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "worker_status" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "worker_status" TYPE "public"."bybit-sub-acc-worker_worker_status_enum_old" USING "worker_status"::"text"::"public"."bybit-sub-acc-worker_worker_status_enum_old"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ALTER COLUMN "worker_status" SET DEFAULT 'submitted'`);
    await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_worker_status_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."bybit-sub-acc-worker_worker_status_enum_old" RENAME TO "bybit-sub-acc-worker_worker_status_enum"`);
    await queryRunner.query(`ALTER TABLE "martingale-2" ALTER COLUMN "enter_by" TYPE character varying`);
    await queryRunner.query(`DROP TYPE "public"."martingale-2_enter_by_enum"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "entry_price"`);
    await queryRunner.query(`DROP TABLE "group-order"`);
    await queryRunner.query(`DROP TABLE "group-order-workers"`);
  }

}
