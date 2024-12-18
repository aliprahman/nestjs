import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateForgotPasswordTable1734508256225 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'forgot_passwords',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: false,
            generationStrategy: 'uuid',
            // generationStrategy?: "uuid" | "increment" | "rowid" | "identity";
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'expire_at',
            type: 'timestamp',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('forgot_passwords');
  }

}
