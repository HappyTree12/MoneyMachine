import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBybitSubAccWorksAndMartigale21713168695976 implements MigrationInterface {
  name = 'AddBybitSubAccWorksAndMartigale21713168695976'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "martingale-2" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "margin_mode" character varying NOT NULL, "category" character varying NOT NULL DEFAULT 'linear', "symbol" character varying NOT NULL, "leverage" integer NOT NULL, "enter_by" character varying NOT NULL, "order_by" character varying NOT NULL, "entries_differences" integer NOT NULL, "activation_percentage" double precision NOT NULL, "retracement_percentage" double precision NOT NULL, "long_entry" double precision array NOT NULL, "long_order" double precision array NOT NULL, "short_entry" double precision array NOT NULL, "short_order" double precision array NOT NULL, "worker_id" uuid NOT NULL, CONSTRAINT "REL_97d34cd9f36efc913fdd77e476" UNIQUE ("worker_id"), CONSTRAINT "PK_59c78e4fbc68ce3fc780748a5f5" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "bybit-sub-acc-worker" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "strategy" character varying NOT NULL, "is_success" boolean, "status_description" character varying, "is_stopped" boolean NOT NULL DEFAULT false, "sub_acc_id" uuid NOT NULL, CONSTRAINT "PK_c5b729f946daf66c7c06b62a5b9" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "martingale-2" ADD CONSTRAINT "FK_97d34cd9f36efc913fdd77e4763" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" ADD CONSTRAINT "FK_d72411c84bd268fc05dc7248c6f" FOREIGN KEY ("sub_acc_id") REFERENCES "bybit-sub-acc"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bybit-sub-acc-worker" DROP CONSTRAINT "FK_d72411c84bd268fc05dc7248c6f"`);
    await queryRunner.query(`ALTER TABLE "martingale-2" DROP CONSTRAINT "FK_97d34cd9f36efc913fdd77e4763"`);
    await queryRunner.query(`DROP TABLE "bybit-sub-acc-worker"`);
    await queryRunner.query(`DROP TABLE "martingale-2"`);
  }

}
