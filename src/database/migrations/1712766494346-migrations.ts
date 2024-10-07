import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBybitMainAccAndSubAcc1712766494346 implements MigrationInterface {
  name = 'AddBybitMainAccAndSubAcc1712766494346'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "bybit-sub-acc" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "api_key" character varying NOT NULL, "api_secret" character varying NOT NULL, "is_test_net" boolean NOT NULL, "account_name" character varying NOT NULL, "acc_uid" integer NOT NULL, "expired_at" TIMESTAMP WITH TIME ZONE, "main_id" uuid NOT NULL, CONSTRAINT "UQ_bb00ee5713daf3ec7dad25df0e7" UNIQUE ("api_key"), CONSTRAINT "PK_32ae9c76413270f66b565fe4581" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "bybit-main-acc" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "api_key" character varying NOT NULL, "api_secret" character varying NOT NULL, "is_test_net" boolean NOT NULL, "acc_uid" integer NOT NULL, "expired_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "UQ_1c829a41ec443e06020ee41ea3c" UNIQUE ("api_key"), CONSTRAINT "REL_dc07eb2d8d8111b176319ca011" UNIQUE ("user_id"), CONSTRAINT "PK_9522245778449b0cef91b420377" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "bybit-main-acc" ADD CONSTRAINT "FK_dc07eb2d8d8111b176319ca0119" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-main-acc" DROP CONSTRAINT "FK_dc07eb2d8d8111b176319ca0119"`);
    await queryRunner.query(`DROP TABLE "bybit-main-acc"`);
    await queryRunner.query(`DROP TABLE "bybit-sub-acc"`);
  }

}
