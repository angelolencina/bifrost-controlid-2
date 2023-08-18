import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRewarUserIpremi1692302337583 implements MigrationInterface {
  name = 'AddRewarUserIpremi1692302337583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_f227a4a423f4d653a95364dcda"`);
    await queryRunner.query(`DROP INDEX "IDX_a7bdde1ec0124ac4f61dd64608"`);
    await queryRunner.query(
      `CREATE TABLE "ipremi_users" ("id" varchar PRIMARY KEY NOT NULL, "user_uuid" varchar NOT NULL, "email" varchar NOT NULL, "participant_id" integer, "participant_token" varchar, "participant_token_valid_through_date" datetime, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_33bef76ba22a82e6d52d9dedad" ON "ipremi_users" ("participant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a4d32396bb3b882f0e3dd6ae0c" ON "ipremi_users" ("participant_token") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ecfc9c381e8998988dd5f60cc8" ON "ipremi_users" ("email", "user_uuid") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at" FROM "rewards"`,
    );
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_rewards" RENAME TO "rewards"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at" FROM "rewards"`,
    );
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_rewards" RENAME TO "rewards"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" datetime, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId" FROM "rewards"`,
    );
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_rewards" RENAME TO "rewards"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" datetime, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" varchar, CONSTRAINT "FK_5a692f5160ebed5c055d4f42769" FOREIGN KEY ("userId") REFERENCES "ipremi_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId" FROM "rewards"`,
    );
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_rewards" RENAME TO "rewards"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `ALTER TABLE "rewards" RENAME TO "temporary_rewards"`,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" datetime, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId" FROM "temporary_rewards"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_rewards"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `ALTER TABLE "rewards" RENAME TO "temporary_rewards"`,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at", "userId" FROM "temporary_rewards"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_rewards"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `ALTER TABLE "rewards" RENAME TO "temporary_rewards"`,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `INSERT INTO "rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at" FROM "temporary_rewards"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_rewards"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_46680bab7bc253420b7002fc21"`);
    await queryRunner.query(
      `ALTER TABLE "rewards" RENAME TO "temporary_rewards"`,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" varchar PRIMARY KEY NOT NULL, "booking_uuid" varchar NOT NULL, "event" varchar NOT NULL, "state" varchar NOT NULL, "participant_id" integer, "participant_token" varchar, "participant_token_valid_through_date" datetime, "action" varchar NOT NULL, "email" varchar NOT NULL, "person" text NOT NULL, "awarded_points" integer NOT NULL, "reward_type" varchar NOT NULL, "place" text NOT NULL, "sync_date" varchar, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `INSERT INTO "rewards"("id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at") SELECT "id", "booking_uuid", "event", "state", "action", "email", "person", "awarded_points", "reward_type", "place", "sync_date", "updated_at", "created_at", "deleted_at" FROM "temporary_rewards"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_rewards"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46680bab7bc253420b7002fc21" ON "rewards" ("booking_uuid", "event", "action", "email") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_ecfc9c381e8998988dd5f60cc8"`);
    await queryRunner.query(`DROP INDEX "IDX_a4d32396bb3b882f0e3dd6ae0c"`);
    await queryRunner.query(`DROP INDEX "IDX_33bef76ba22a82e6d52d9dedad"`);
    await queryRunner.query(`DROP TABLE "ipremi_users"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a7bdde1ec0124ac4f61dd64608" ON "rewards" ("participant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f227a4a423f4d653a95364dcda" ON "rewards" ("participant_token") `,
    );
  }
}
