import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean, IsDateString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {
  @ApiProperty({ example: 'newpassword123', description: 'New password (min 6 characters)', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'uuid-of-updater', description: 'ID of user making the update', required: false })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
