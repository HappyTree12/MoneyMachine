import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSignalParamsDefaultTable1722236938502
  implements MigrationInterface
{
  name = 'AddSignalParamsDefaultTable1722236938502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."strategy-params_strategy_type_enum" AS ENUM('martingale_1', 'martingale_2', 'martingale_3', 'martingale_1_combo', 'martingale_2_combo', 'strategy_1', 'strategy_2', 'strategy_3', 'strategy_5')`,
    );
    await queryRunner.query(
      `CREATE TABLE "strategy-params" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "strategy_type" "public"."strategy-params_strategy_type_enum" NOT NULL, "parameters" json NOT NULL, CONSTRAINT "UQ_c246cc4c0e677edf20700cc5d51" UNIQUE ("strategy_type"), CONSTRAINT "PK_beacd94b460e14d262babfb6fb8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "strategy-params" ("strategy_type", "parameters") VALUES ('strategy_1', '{"tpRatio":2,"slRatio":1.5,"useEma":true,"useAdx":true,"useSsl":true,"emaLength":100,"smoothPeriod":7,"diLength":14,"adxThreshold":40,"atrMult":1,"atrLen":14,"atrSmoothing":"WMA","ssl1Smoothing":"HMA","ssl1Length":60,"ssl2Smoothing":"JMA","ssl2Length":5,"exitSmoothing":"HMA","exitLength":15,"isPartialMode":false}')`,
    );
    await queryRunner.query(
      `INSERT INTO "strategy-params" ("strategy_type", "parameters") VALUES ('strategy_2', '{"tpRatio":1,"slRatio":5,"useEma1":true,"useEma2":true,"useAdx":true,"useHvol":true,"emaLength1":20,"emaLength2":26,"smoothPeriod":7,"diLength":14,"adxThreshold":20,"meanLength":610,"stdLength":610,"thresholdExtraHigh":4,"thresholdHigh":2.5,"thresholdMedium":1,"thresholdNormal":-0.5}')`,
    );
    await queryRunner.query(
      `INSERT INTO "strategy-params" ("strategy_type", "parameters") VALUES ('strategy_3', '{"tpRatio":2,"slRatio":2,"useEma":true,"useMacd":true,"emaLength":52,"emaCandlestickCount":10,"macdThreshold":0}')`,
    );
    await queryRunner.query(
      `INSERT INTO "strategy-params" ("strategy_type", "parameters") VALUES ('strategy_5', '{"tpRatio":1.5,"slRatio":0,"useEma1":true,"useEma2":true,"useAdx":true,"useRsi":true,"useAtr":true,"emaLength1":100,"emaLength2":200,"smoothPeriod":14,"diLength":14,"adxThreshold":20,"rsiLength":14,"rsiBuyThreshold":20,"rsiSellThreshold":80}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "strategy-params"`);
    await queryRunner.query(`DROP TABLE "strategy-params"`);
    await queryRunner.query(
      `DROP TYPE "public"."strategy-params_strategy_type_enum"`,
    );
  }
}
