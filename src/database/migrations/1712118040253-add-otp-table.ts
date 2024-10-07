import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpTable1712118040253 implements MigrationInterface {
    name = 'AddOtpTable1712118040253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "otp" character varying NOT NULL, "expired_at" TIMESTAMP NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otps"`);
    }

}
