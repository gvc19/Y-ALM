import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ example: 'uuid-here', description: 'Role unique identifier' })
  id: string;

  @ApiProperty({ example: 'Admin', description: 'Role name' })
  name: string;

  @ApiProperty({ example: true, description: 'Role active status' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Role deleted status' })
  isDeleted: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Role creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: 'uuid-of-creator', description: 'ID of user who created this role' })
  createdBy: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Role last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'uuid-of-updater', description: 'ID of user who last updated this role' })
  updatedBy: string;
}
