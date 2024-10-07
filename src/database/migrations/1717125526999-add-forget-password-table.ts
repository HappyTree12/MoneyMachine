import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForgetPasswordTable1717125526999 implements MigrationInterface {
    name = 'AddForgetPasswordTable1717125526999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "forget_password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "short_token" character varying NOT NULL, CONSTRAINT "PK_72506e37c3b5302110f6674fc28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "forget_password" ADD CONSTRAINT "FK_9d836fa6ed6026dae7691f20a4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forget_password" DROP CONSTRAINT "FK_9d836fa6ed6026dae7691f20a4a"`);
        await queryRunner.query(`DROP TABLE "forget_password"`);
    }

}
