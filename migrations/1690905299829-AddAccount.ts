import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccount1690905299829 implements MigrationInterface {
  name = 'AddAccount1690905299829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "integration" text, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_490319656e54a7957dc1fed027" ON "accounts" ("code") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_490319656e54a7957dc1fed027"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
  }
}
