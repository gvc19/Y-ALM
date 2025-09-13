import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRolesTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'master_role',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'isDeleted',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'createdBy',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedBy',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX idx_master_role_name ON "master_role"(name);
    `);
    
    await queryRunner.query(`
      CREATE INDEX idx_master_role_is_active ON "master_role"("isActive");
    `);
    
    await queryRunner.query(`
      CREATE INDEX idx_master_role_is_deleted ON "master_role"("isDeleted");
    `);
    
    await queryRunner.query(`
      CREATE INDEX idx_master_role_created_at ON "master_role"("createdAt");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('master_role');
  }
}
