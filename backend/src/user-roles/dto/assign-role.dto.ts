import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ example: 'uuid-role-id', description: 'Role ID to assign' })
  @IsString()
  @IsUUID()
  roleId: string;

  @ApiProperty({ example: true, description: 'Assignment active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
