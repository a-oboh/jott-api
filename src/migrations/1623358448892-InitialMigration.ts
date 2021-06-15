import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1623358448892 implements MigrationInterface {
    name = 'InitialMigration1623358448892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `confirmationToken` varchar(255) NOT NULL DEFAULT '', `resetCode` varchar(255) NOT NULL DEFAULT '', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `notes` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL, `folderId` varchar(36) NULL, `ownerId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `folders` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `description` varchar(500) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL, `ownerId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `notes_members_users` (`notesId` varchar(36) NOT NULL, `usersId` varchar(36) NOT NULL, INDEX `IDX_39315b708ace241b8eca16d353` (`notesId`), INDEX `IDX_429585248688da8ece09713112` (`usersId`), PRIMARY KEY (`notesId`, `usersId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `folders_members_users` (`foldersId` varchar(36) NOT NULL, `usersId` varchar(36) NOT NULL, INDEX `IDX_3355d1ca9a110c86f422c61f1f` (`foldersId`), INDEX `IDX_4abad25257221650d30f8e15a3` (`usersId`), PRIMARY KEY (`foldersId`, `usersId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `notes` ADD CONSTRAINT `FK_15b6167f4f03b7fa7cc54fa3d79` FOREIGN KEY (`folderId`) REFERENCES `folders`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `notes` ADD CONSTRAINT `FK_8fcc29811c424b531ac9a341d29` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `folders` ADD CONSTRAINT `FK_6228242ce9f7a8f3aec9397c6a7` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `notes_members_users` ADD CONSTRAINT `FK_39315b708ace241b8eca16d353d` FOREIGN KEY (`notesId`) REFERENCES `notes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `notes_members_users` ADD CONSTRAINT `FK_429585248688da8ece09713112f` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `folders_members_users` ADD CONSTRAINT `FK_3355d1ca9a110c86f422c61f1fb` FOREIGN KEY (`foldersId`) REFERENCES `folders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `folders_members_users` ADD CONSTRAINT `FK_4abad25257221650d30f8e15a3a` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `folders_members_users` DROP FOREIGN KEY `FK_4abad25257221650d30f8e15a3a`");
        await queryRunner.query("ALTER TABLE `folders_members_users` DROP FOREIGN KEY `FK_3355d1ca9a110c86f422c61f1fb`");
        await queryRunner.query("ALTER TABLE `notes_members_users` DROP FOREIGN KEY `FK_429585248688da8ece09713112f`");
        await queryRunner.query("ALTER TABLE `notes_members_users` DROP FOREIGN KEY `FK_39315b708ace241b8eca16d353d`");
        await queryRunner.query("ALTER TABLE `folders` DROP FOREIGN KEY `FK_6228242ce9f7a8f3aec9397c6a7`");
        await queryRunner.query("ALTER TABLE `notes` DROP FOREIGN KEY `FK_8fcc29811c424b531ac9a341d29`");
        await queryRunner.query("ALTER TABLE `notes` DROP FOREIGN KEY `FK_15b6167f4f03b7fa7cc54fa3d79`");
        await queryRunner.query("DROP INDEX `IDX_4abad25257221650d30f8e15a3` ON `folders_members_users`");
        await queryRunner.query("DROP INDEX `IDX_3355d1ca9a110c86f422c61f1f` ON `folders_members_users`");
        await queryRunner.query("DROP TABLE `folders_members_users`");
        await queryRunner.query("DROP INDEX `IDX_429585248688da8ece09713112` ON `notes_members_users`");
        await queryRunner.query("DROP INDEX `IDX_39315b708ace241b8eca16d353` ON `notes_members_users`");
        await queryRunner.query("DROP TABLE `notes_members_users`");
        await queryRunner.query("DROP TABLE `folders`");
        await queryRunner.query("DROP TABLE `notes`");
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
