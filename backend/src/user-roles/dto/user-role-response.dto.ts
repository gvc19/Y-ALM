import { ApiProperty } from '@nestjs/swagger';

export class UserRoleResponseDto {
  @ApiProperty({ example: 'uuid-here', description: 'User-Role mapping unique identifier' })
  id: string;

  @ApiProperty({ example: 'uuid-user-id', description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'uuid-role-id', description: 'Role ID' })
  roleId: string;

  @ApiProperty({ example: 'Admin', description: 'Role name' })
  roleName: string;

  @ApiProperty({ example: true, description: 'Assignment active status' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Assignment deleted status' })
  isDeleted: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Assignment creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: 'uuid-of-creator', description: 'ID of user who created this assignment' })
  createdBy: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Assignment last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'uuid-of-updater', description: 'ID of user who last updated this assignment' })
  updatedBy: string;
}
