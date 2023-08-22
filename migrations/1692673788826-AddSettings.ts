import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettings1692673788826 implements MigrationInterface {
    name = 'AddSettings1692673788826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "value" varchar NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ca7857276d2a30f4dcfa0e42cd" ON "settings" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e1d1732465eafe739564acacc" ON "settings" ("value") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_0e1d1732465eafe739564acacc"`);
        await queryRunner.query(`DROP INDEX "IDX_ca7857276d2a30f4dcfa0e42cd"`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
