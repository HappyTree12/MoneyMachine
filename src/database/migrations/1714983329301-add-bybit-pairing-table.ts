import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBybitPairingTable1714983329301 implements MigrationInterface {
  name = 'AddBybitPairingTable1714983329301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bybit-pairing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "symbol" character varying NOT NULL, "contract_type" character varying NOT NULL, "status" character varying(20) NOT NULL, "base_coin" character varying NOT NULL, "quote_coin" character varying NOT NULL, "priority" integer NOT NULL, "is_active" boolean NOT NULL, CONSTRAINT "PK_fff8ef5fd2bbacedc636dabe6b8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bybit-pairing"`);
  }
}
