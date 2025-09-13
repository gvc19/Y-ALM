import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Role name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: true, description: 'Role active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
