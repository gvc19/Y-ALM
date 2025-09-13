import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'Id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'First_Name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'Last_Name',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'Email',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'Hashed_Password',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'dob',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'Is_Active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'Is_deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'Created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'Created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'Updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'Updated_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create uuid-ossp extension if it doesn't exist
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
