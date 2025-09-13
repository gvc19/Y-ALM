import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-here', description: 'User unique identifier' })
  id: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: '1990-01-01', description: 'User date of birth' })
  dateOfBirth: Date;

  @ApiProperty({ example: true, description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'User deleted status' })
  isDeleted: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: 'uuid-of-creator', description: 'ID of user who created this user' })
  createdBy: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'uuid-of-updater', description: 'ID of user who last updated this user' })
  updatedBy: string;

  @Exclude()
  password: string;
}
