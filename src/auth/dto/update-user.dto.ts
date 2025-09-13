import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsUUID, IsBoolean, IsDate, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString()
  First_Name?: string;

  @IsOptional()
  @IsString()
  Last_Name?: string;

  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  Is_Active?: boolean;

  @IsOptional()
  @IsBoolean()
  Is_deleted?: boolean;

  @IsOptional()
  @IsUUID()
  Updated_by?: string;
}
