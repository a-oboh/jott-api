import {MigrationInterface, QueryRunner} from "typeorm";

export class UserPhotoUrl1623580312162 implements MigrationInterface {
    name = 'UserPhotoUrl1623580312162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `photoUrl` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD `firebaseUuid` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_65b5dab3fb7160105cca17ab5a` (`firebaseUuid`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_65b5dab3fb7160105cca17ab5a`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `firebaseUuid`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `photoUrl`");
    }

}
