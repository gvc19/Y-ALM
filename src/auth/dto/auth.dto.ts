import { IsEmail, IsString, MinLength, IsOptional, IsDate, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  First_Name: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  Last_Name?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsDate()
  dob?: Date;
}

export class UserResponseDto {
  @ApiProperty()
  Id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  First_Name: string;

  @ApiProperty()
  Last_Name: string;

  @ApiProperty()
  Email: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  Is_Active: boolean;

  @ApiProperty()
  Is_deleted: boolean;

  @ApiProperty()
  Created_at: Date;

  @ApiProperty()
  Created_by: string;

  @ApiProperty()
  Updated_at: Date;

  @ApiProperty()
  Updated_by: string;
}
