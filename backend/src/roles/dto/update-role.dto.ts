import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ example: 'uuid-of-updater', description: 'ID of user making the update', required: false })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
