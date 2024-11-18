import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketAndMessageEntities1731956364368 implements MigrationInterface {
    name = 'TicketAndMessageEntities1731956364368';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "ticket"`);
        await queryRunner.query(
            `CREATE TABLE "ticket"."message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "content" character varying NOT NULL, "ticketId" uuid, "senderId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "ticket"."ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "title" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'open', "userId" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "ticket"."message" ADD CONSTRAINT "FK_0b780eaa7d705c91500fc22bf8c" FOREIGN KEY ("ticketId") REFERENCES "ticket"."ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "ticket"."message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "person"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "ticket"."ticket" ADD CONSTRAINT "FK_0e01a7c92f008418bad6bad5919" FOREIGN KEY ("userId") REFERENCES "person"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "ticket"."ticket" DROP CONSTRAINT "FK_0e01a7c92f008418bad6bad5919"`,
        );
        await queryRunner.query(
            `ALTER TABLE "ticket"."message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`,
        );
        await queryRunner.query(
            `ALTER TABLE "ticket"."message" DROP CONSTRAINT "FK_0b780eaa7d705c91500fc22bf8c"`,
        );
        await queryRunner.query(`DROP TABLE "ticket"."ticket"`);
        await queryRunner.query(`DROP TABLE "ticket"."message"`);
    }
}
