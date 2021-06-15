import {MigrationInterface, QueryRunner} from "typeorm";

export class FirebaseUidNullable1623580783840 implements MigrationInterface {
    name = 'FirebaseUidNullable1623580783840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_65b5dab3fb7160105cca17ab5a` ON `users`");
        await queryRunner.query("ALTER TABLE `users` CHANGE `firebaseUuid` `firebaseUuid` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_65b5dab3fb7160105cca17ab5a` (`firebaseUuid`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_65b5dab3fb7160105cca17ab5a`");
        await queryRunner.query("ALTER TABLE `users` CHANGE `firebaseUuid` `firebaseUuid` varchar(255) NOT NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_65b5dab3fb7160105cca17ab5a` ON `users` (`firebaseUuid`)");
    }

}
