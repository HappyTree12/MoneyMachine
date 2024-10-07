import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMartingale2Combo1719202423402 implements MigrationInterface {
    name = 'UpdateMartingale2Combo1719202423402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" DROP COLUMN "entries_differences"`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" ADD "entries_differences" integer array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" DROP COLUMN "activation_percentage"`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" ADD "activation_percentage" double precision array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" DROP COLUMN "retracement_percentage"`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" ADD "retracement_percentage" double precision array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" DROP COLUMN "retracement_percentage"`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" ADD "retracement_percentage" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" DROP COLUMN "activation_percentage"`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" ADD "activation_percentage" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" DROP COLUMN "entries_differences"`);
        await queryRunner.query(`ALTER TABLE "martingale-2-combo" ADD "entries_differences" integer NOT NULL`);
    }

}
