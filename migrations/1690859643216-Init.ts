import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1690859643216 implements MigrationInterface {
  name = 'Init1690859643216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" varchar PRIMARY KEY NOT NULL, "uuid" varchar NOT NULL, "event" varchar NOT NULL, "start_date" varchar NOT NULL, "end_date" varchar NOT NULL, "tolerance" varchar, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text, "external_id" varchar, "place" text, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d68ca471f015bbbce09ba5991a" ON "bookings" ("uuid", "event", "email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "configurations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "credential" text, "system" varchar NOT NULL, "token" varchar, "token_expires_in" datetime, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96fa4b5625ef429ec67cbeeece" ON "configurations" ("system") `,
    );
    await queryRunner.query(
      `CREATE TABLE "entranceLogs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "id_device" integer NOT NULL, "device_name" varchar NOT NULL, "reader" integer NOT NULL, "id_area" integer NOT NULL, "area" varchar NOT NULL, "event" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "participant_id" integer, "participant_token" varchar, "participant_token_valid_through_date" datetime, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7bdde1ec0124ac4f61dd64608" ON "rewards" ("participant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f227a4a423f4d653a95364dcda" ON "rewards" ("participant_token") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(`DROP INDEX "IDX_f227a4a423f4d653a95364dcda"`);
    await queryRunner.query(`DROP INDEX "IDX_a7bdde1ec0124ac4f61dd64608"`);
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(`DROP TABLE "entranceLogs"`);
    await queryRunner.query(`DROP INDEX "IDX_96fa4b5625ef429ec67cbeeece"`);
    await queryRunner.query(`DROP TABLE "configurations"`);
    await queryRunner.query(`DROP INDEX "IDX_d68ca471f015bbbce09ba5991a"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
  }
}
