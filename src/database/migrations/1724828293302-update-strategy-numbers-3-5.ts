import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStrategyNumbers351724828293302 implements MigrationInterface {
  name = 'UpdateStrategyNumbers351724828293302'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "strategy-3" RENAME TO "strategy-temp";`);
    await queryRunner.query(`ALTER TABLE "strategy-5" RENAME TO "strategy-3";`);
    await queryRunner.query(`ALTER TABLE "strategy-temp" RENAME TO "strategy-5";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "strategy-3" RENAME TO "strategy-temp";`);
    await queryRunner.query(`ALTER TABLE "strategy-5" RENAME TO "strategy-3";`);
    await queryRunner.query(`ALTER TABLE "strategy-temp" RENAME TO "strategy-5";`);
  }

}
