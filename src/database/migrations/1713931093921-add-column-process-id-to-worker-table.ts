import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnProcessIdToWorkerTable1713931093921 implements MigrationInterface {
  name = 'AddColumnProcessIdToWorkerTable1713931093921'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "process_id" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "process_id"`);
  }

}
