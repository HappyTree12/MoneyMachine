import { MigrationInterface, QueryRunner } from "typeorm";

export class RestructureBybitSubAccWorkersAndMartingale21713432323228 implements MigrationInterface {
  name = 'RestructureBybitSubAccWorkersAndMartingale21713432323228'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP CONSTRAINT "FK_d72411c84bd268fc05dc7248c6f"`);
    await queryRunner.query(`ALTER TABLE "martingale-2" DROP COLUMN "margin_mode"`);
    await queryRunner.query(`ALTER TABLE "martingale-2" DROP COLUMN "category"`);
    await queryRunner.query(`ALTER TABLE "martingale-2" DROP COLUMN "symbol"`);
    await queryRunner.query(`ALTER TABLE "martingale-2" DROP COLUMN "leverage"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "strategy"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "is_success"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "is_stopped"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "sub_acc_id"`);
    await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_strategy_type_enum" AS ENUM('martingale_2')`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "strategy_type" "public"."bybit-sub-acc-worker_strategy_type_enum" NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "margin_mode" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "category" character varying NOT NULL DEFAULT 'linear'`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "symbol" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "leverage" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "investment_amount" double precision NOT NULL`);
    await queryRunner.query(`CREATE TYPE "public"."bybit-sub-acc-worker_worker_status_enum" AS ENUM('submitted', 'running', 'completed', 'error', 'stopped')`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "worker_status" "public"."bybit-sub-acc-worker_worker_status_enum" NOT NULL DEFAULT 'submitted'`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "bybit_sub_acc_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD CONSTRAINT "FK_e76b3c8c1392e561f9332ab2394" FOREIGN KEY ("bybit_sub_acc_id") REFERENCES "bybit-sub-acc"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP CONSTRAINT "FK_e76b3c8c1392e561f9332ab2394"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "bybit_sub_acc_id"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "worker_status"`);
    await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_worker_status_enum"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "investment_amount"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "leverage"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "symbol"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "category"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "margin_mode"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "strategy_type"`);
    await queryRunner.query(`DROP TYPE "public"."bybit-sub-acc-worker_strategy_type_enum"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "sub_acc_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "is_stopped" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "is_success" boolean`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "strategy" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "martingale-2" ADD "leverage" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "martingale-2" ADD "symbol" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "martingale-2" ADD "category" character varying NOT NULL DEFAULT 'linear'`);
    await queryRunner.query(`ALTER TABLE "martingale-2" ADD "margin_mode" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD CONSTRAINT "FK_d72411c84bd268fc05dc7248c6f" FOREIGN KEY ("sub_acc_id") REFERENCES "bybit-sub-acc"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

}
