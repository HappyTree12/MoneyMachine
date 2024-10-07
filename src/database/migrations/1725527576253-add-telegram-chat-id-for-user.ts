import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTelegramChatIdForUser1725527576253 implements MigrationInterface {
    name = 'AddTelegramChatIdForUser1725527576253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "telegram_chat_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "telegram_chat_id"`);
    }

}
