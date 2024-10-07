import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMinMaxCapitalRenameInitialInvestmentToInitialCapital1714718510442 implements MigrationInterface {
  name = 'AddMinMaxCapitalRenameInitialInvestmentToInitialCapital1714718510442'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" RENAME COLUMN "investment_amount" TO "initial_capital"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "min_capital" double precision NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD "max_capital" double precision NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "max_capital"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP COLUMN "min_capital"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" RENAME COLUMN "initial_capital" TO "investment_amount"`);
  }

}
