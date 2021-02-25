import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationTwo1614266825974 implements MigrationInterface {
    name = 'MigrationTwo1614266825974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` CHANGE `deletedAt` `deletedAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `notes` DROP FOREIGN KEY `FK_8fcc29811c424b531ac9a341d29`");
        await queryRunner.query("ALTER TABLE `notes` CHANGE `deletedAt` `deletedAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `notes` CHANGE `ownerId` `ownerId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `notes` ADD CONSTRAINT `FK_8fcc29811c424b531ac9a341d29` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `notes` DROP FOREIGN KEY `FK_8fcc29811c424b531ac9a341d29`");
        await queryRunner.query("ALTER TABLE `notes` CHANGE `ownerId` `ownerId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `notes` CHANGE `deletedAt` `deletedAt` datetime(6) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `notes` ADD CONSTRAINT `FK_8fcc29811c424b531ac9a341d29` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users` CHANGE `deletedAt` `deletedAt` datetime(6) NULL DEFAULT 'NULL'");
    }

}
