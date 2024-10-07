import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsLoopToWorkerTable1714027490816 implements MigrationInterface {
  name = 'AddColumnIsLoopToWorkerTable1714027490816'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "is_loop" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "is_loop"`);
  }

}
