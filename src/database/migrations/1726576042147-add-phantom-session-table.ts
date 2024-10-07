import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhantomSessionTable1726576042147 implements MigrationInterface {
  name = 'AddPhantomSessionTable1726576042147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phantom" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "dapp_public_key" bytea NOT NULL, "dapp_secretkey" bytea NOT NULL, "shared_secret" bytea, "chat_id" integer NOT NULL, "session_public_key" character varying, "session" character varying, CONSTRAINT "PK_573ed3a87551e191c844856c930" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "phantom"`);
  }
}
