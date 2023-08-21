import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDatabaseUpdates1692643440703 implements MigrationInterface {
  name = 'AlterDatabaseUpdates1692643440703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_96fa4b5625ef429ec67cbeeece"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_entranceLogs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "id_device" integer NOT NULL, "device_name" varchar NOT NULL, "reader" integer NOT NULL, "id_area" integer NOT NULL, "area" varchar NOT NULL, "event" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "log_id" integer, "event_description" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_entranceLogs"("id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at") SELECT "id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at" FROM "entranceLogs"`,
    );
    await queryRunner.query(`DROP TABLE "entranceLogs"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_entranceLogs" RENAME TO "entranceLogs"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_entranceLogs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "id_device" integer NOT NULL, "device_name" varchar NOT NULL, "reader" integer, "id_area" integer, "area" varchar, "event" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "log_id" integer, "event_description" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_entranceLogs"("id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at", "log_id", "event_description") SELECT "id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at", "log_id", "event_description" FROM "entranceLogs"`,
    );
    await queryRunner.query(`DROP TABLE "entranceLogs"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_entranceLogs" RENAME TO "entranceLogs"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_faa1e86e8cede361c6c3451c0b" ON "configurations" ("system") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_afb68c6a964edcb04f10888c25" ON "entranceLogs" ("log_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_afb68c6a964edcb04f10888c25"`);
    await queryRunner.query(`DROP INDEX "IDX_faa1e86e8cede361c6c3451c0b"`);
    await queryRunner.query(
      `ALTER TABLE "entranceLogs" RENAME TO "temporary_entranceLogs"`,
    );
    await queryRunner.query(
      `CREATE TABLE "entranceLogs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "id_device" integer NOT NULL, "device_name" varchar NOT NULL, "reader" integer NOT NULL, "id_area" integer NOT NULL, "area" varchar NOT NULL, "event" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "log_id" integer, "event_description" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "entranceLogs"("id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at", "log_id", "event_description") SELECT "id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at", "log_id", "event_description" FROM "temporary_entranceLogs"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_entranceLogs"`);
    await queryRunner.query(
      `ALTER TABLE "entranceLogs" RENAME TO "temporary_entranceLogs"`,
    );
    await queryRunner.query(
      `CREATE TABLE "entranceLogs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "id_device" integer NOT NULL, "device_name" varchar NOT NULL, "reader" integer NOT NULL, "id_area" integer NOT NULL, "area" varchar NOT NULL, "event" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "entranceLogs"("id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at") SELECT "id", "email", "id_device", "device_name", "reader", "id_area", "area", "event", "created_at" FROM "temporary_entranceLogs"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_entranceLogs"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96fa4b5625ef429ec67cbeeece" ON "configurations" ("system") `,
    );
  }
}
