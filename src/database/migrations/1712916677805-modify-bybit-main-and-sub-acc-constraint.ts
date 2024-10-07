import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyBybitMainAndSubAccConstraint1712916677805 implements MigrationInterface {
  name = 'ModifyBybitMainAndSubAccConstraint1712916677805'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc" RENAME COLUMN "main_id" TO "main_acc_id"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc" ADD CONSTRAINT "FK_62bf7284530813e71370a861e6a" FOREIGN KEY ("main_acc_id") REFERENCES "bybit-main-acc"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc" DROP CONSTRAINT "FK_62bf7284530813e71370a861e6a"`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc" RENAME COLUMN "main_acc_id" TO "main_id"`);
  }

}
