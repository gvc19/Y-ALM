import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserRoleMappingTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_role_mapping',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'uuid',
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

    // Create foreign key constraints
    await queryRunner.createForeignKey(
      'user_role_mapping',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_role_mapping',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'master_role',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX idx_user_role_mapping_user_id ON "user_role_mapping"("user_id");
    `);
    
    await queryRunner.query(`
      CREATE INDEX idx_user_role_mapping_role_id ON "user_role_mapping"("role_id");
    `);
    
    await queryRunner.query(`
      CREATE INDEX idx_user_role_mapping_is_active ON "user_role_mapping"("isActive");
    `);
    
    await queryRunner.query(`
      CREATE INDEX idx_user_role_mapping_is_deleted ON "user_role_mapping"("isDeleted");
    `);

    // Create unique constraint to prevent duplicate user-role assignments
    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_user_role_mapping_unique 
      ON "user_role_mapping"("user_id", "role_id") 
      WHERE "isDeleted" = false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_role_mapping');
  }
}
