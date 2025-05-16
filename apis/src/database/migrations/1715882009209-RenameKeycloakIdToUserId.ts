import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameKeycloakIdToUserId1715882009209
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE patient RENAME COLUMN "createdByKeycloakId" TO "createdByUserId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE patient RENAME COLUMN "createdByUserId" TO "createdByKeycloakId"`,
    );
  }
}
