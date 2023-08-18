import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPersonalBadges1692289338811 implements MigrationInterface {
  name = 'AddPersonalBadges1692289338811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_490319656e54a7957dc1fed027"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_accounts" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "integration" text, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_accounts"("id", "code", "integration", "updated_at", "created_at") SELECT "id", "code", "integration", "updated_at", "created_at" FROM "accounts"`,
    );
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_accounts" RENAME TO "accounts"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_490319656e54a7957dc1fed027" ON "accounts" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "personal_badges" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "sync_date" datetime, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c7c1d0906d3cd58091bbdb98a" ON "personal_badges" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4493dd090eb5cc1ea96ac36a8" ON "personal_badges" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e78543216e9e1ccf770a9c8737" ON "personal_badges" ("sync_date") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_490319656e54a7957dc1fed027"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_accounts" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar, "integration" text, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_accounts"("id", "code", "integration", "updated_at", "created_at") SELECT "id", "code", "integration", "updated_at", "created_at" FROM "accounts"`,
    );
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_accounts" RENAME TO "accounts"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_490319656e54a7957dc1fed027" ON "accounts" ("code") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_d68ca471f015bbbce09ba5991a"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_bookings" ("id" varchar PRIMARY KEY NOT NULL, "uuid" varchar NOT NULL, "event" varchar NOT NULL, "start_date" datetime NOT NULL, "end_date" datetime NOT NULL, "tolerance" text, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text, "external_id" varchar, "place" text, "sync_date" datetime, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_bookings"("id", "uuid", "event", "start_date", "end_date", "tolerance", "state", "action", "email", "person", "external_id", "place", "sync_date", "updated_at", "created_at", "deleted_at") SELECT "id", "uuid", "event", "start_date", "end_date", "tolerance", "state", "action", "email", "person", "external_id", "place", "sync_date", "updated_at", "created_at", "deleted_at" FROM "bookings"`,
    );
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_bookings" RENAME TO "bookings"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d68ca471f015bbbce09ba5991a" ON "bookings" ("uuid", "event", "email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_d68ca471f015bbbce09ba5991a"`);
    await queryRunner.query(
      `ALTER TABLE "bookings" RENAME TO "temporary_bookings"`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" varchar PRIMARY KEY NOT NULL, "uuid" varchar NOT NULL, "event" varchar NOT NULL, "start_date" varchar NOT NULL, "end_date" varchar NOT NULL, "tolerance" varchar, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text, "external_id" varchar, "place" text, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `INSERT INTO "bookings"("id", "uuid", "event", "start_date", "end_date", "tolerance", "state", "action", "email", "person", "external_id", "place", "sync_date", "updated_at", "created_at", "deleted_at") SELECT "id", "uuid", "event", "start_date", "end_date", "tolerance", "state", "action", "email", "person", "external_id", "place", "sync_date", "updated_at", "created_at", "deleted_at" FROM "temporary_bookings"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_bookings"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d68ca471f015bbbce09ba5991a" ON "bookings" ("uuid", "event", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_490319656e54a7957dc1fed027"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" RENAME TO "temporary_accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "integration" text, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "accounts"("id", "code", "integration", "updated_at", "created_at") SELECT "id", "code", "integration", "updated_at", "created_at" FROM "temporary_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_accounts"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_490319656e54a7957dc1fed027" ON "accounts" ("code") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_e78543216e9e1ccf770a9c8737"`);
    await queryRunner.query(`DROP INDEX "IDX_c4493dd090eb5cc1ea96ac36a8"`);
    await queryRunner.query(`DROP INDEX "IDX_3c7c1d0906d3cd58091bbdb98a"`);
    await queryRunner.query(`DROP TABLE "personal_badges"`);
    await queryRunner.query(`DROP INDEX "IDX_490319656e54a7957dc1fed027"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" RENAME TO "temporary_accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "integration" text, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "accounts"("id", "code", "integration", "updated_at", "created_at") SELECT "id", "code", "integration", "updated_at", "created_at" FROM "temporary_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_accounts"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_490319656e54a7957dc1fed027" ON "accounts" ("code") `,
    );
  }
}
