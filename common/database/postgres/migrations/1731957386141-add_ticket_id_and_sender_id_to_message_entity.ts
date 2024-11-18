import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTicketIdAndSenderIdToMessageEntity1731957386141 implements MigrationInterface {
    name = 'AddTicketIdAndSenderIdToMessageEntity1731957386141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket"."message" DROP CONSTRAINT "FK_0b780eaa7d705c91500fc22bf8c"`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ALTER COLUMN "ticketId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ALTER COLUMN "senderId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ADD CONSTRAINT "FK_0b780eaa7d705c91500fc22bf8c" FOREIGN KEY ("ticketId") REFERENCES "ticket"."ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "person"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket"."message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" DROP CONSTRAINT "FK_0b780eaa7d705c91500fc22bf8c"`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ALTER COLUMN "senderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ALTER COLUMN "ticketId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "person"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket"."message" ADD CONSTRAINT "FK_0b780eaa7d705c91500fc22bf8c" FOREIGN KEY ("ticketId") REFERENCES "ticket"."ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
