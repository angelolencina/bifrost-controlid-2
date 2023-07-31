import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1690826187218 implements MigrationInterface {
  name = 'Init1690826187218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" varchar PRIMARY KEY NOT NULL, "uuid" varchar NOT NULL, "event" varchar NOT NULL, "start_date" varchar NOT NULL, "end_date" varchar NOT NULL, "tolerance" varchar, "state" varchar NOT NULL, "action" varchar NOT NULL, "person" text, "external_id" varchar, "place" text, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3a5b02cbe556f2f6bea8f06f0b" ON "bookings" ("uuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_778cf5eec519c4df75331afc2f" ON "bookings" ("event") `,
    );
    await queryRunner.query(
      `CREATE TABLE "configurations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "credential" text, "account" varchar NOT NULL, "token" varchar, "token_expires_in" datetime, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96fa4b5625ef429ec67cbeeece" ON "configurations" ("account") `,
    );
    await queryRunner.query(
      `CREATE TABLE "entranceLogs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "id_device" integer NOT NULL, "device_name" varchar NOT NULL, "reader" integer NOT NULL, "id_area" integer NOT NULL, "area" varchar NOT NULL, "event" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "state" varchar NOT NULL, "participant_id" integer, "participant_token" varchar, "participant_token_valid_through_date" datetime, "action" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "place" text NOT NULL, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_886cd7a56ba38f8029ce4f088a" ON "rewards" ("booking_uuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7bdde1ec0124ac4f61dd64608" ON "rewards" ("participant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f227a4a423f4d653a95364dcda" ON "rewards" ("participant_token") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_f227a4a423f4d653a95364dcda"`);
    await queryRunner.query(`DROP INDEX "IDX_a7bdde1ec0124ac4f61dd64608"`);
    await queryRunner.query(`DROP INDEX "IDX_886cd7a56ba38f8029ce4f088a"`);
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(`DROP TABLE "entranceLogs"`);
    await queryRunner.query(`DROP INDEX "IDX_96fa4b5625ef429ec67cbeeece"`);
    await queryRunner.query(`DROP TABLE "configurations"`);
    await queryRunner.query(`DROP INDEX "IDX_778cf5eec519c4df75331afc2f"`);
    await queryRunner.query(`DROP INDEX "IDX_3a5b02cbe556f2f6bea8f06f0b"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
  }
}
