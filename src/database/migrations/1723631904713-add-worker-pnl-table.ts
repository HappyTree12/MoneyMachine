import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkerPnlTable1723631904713 implements MigrationInterface {
  name = 'AddWorkerPnlTable1723631904713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "worker-pnl" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "closed_pnl" double precision NOT NULL, "pnl_details" json NOT NULL, "closing_side" character varying, "worker_id" uuid NOT NULL, CONSTRAINT "PK_69dd563c8e8e76e39f456e57c0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "worker-pnl" ADD CONSTRAINT "FK_75df6e6197ec425782dc5dba773" FOREIGN KEY ("worker_id") REFERENCES "bybit-sub-acc-worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "worker-pnl" DROP CONSTRAINT "FK_75df6e6197ec425782dc5dba773"`,
    );
    await queryRunner.query(`DROP TABLE "worker-pnl"`);
  }
}
