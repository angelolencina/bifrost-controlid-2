import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPersonalBadges1691116497215 implements MigrationInterface {
  name = 'AddPersonalBadges1691116497215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "personal_badges" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "sync_date" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_e78543216e9e1ccf770a9c8737"`);
    await queryRunner.query(`DROP INDEX "IDX_c4493dd090eb5cc1ea96ac36a8"`);
    await queryRunner.query(`DROP INDEX "IDX_3c7c1d0906d3cd58091bbdb98a"`);
    await queryRunner.query(`DROP TABLE "personal_badges"`);
  }
}
