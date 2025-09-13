import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserQueryDto {
  @ApiProperty({ example: 'john', description: 'Search term for username, firstName, lastName, or email', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: true, description: 'Filter by active status', required: false })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({ example: 1, description: 'Page number for pagination', required: false, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'Number of items per page', required: false, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ example: 'createdAt', description: 'Field to sort by', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ example: 'DESC', description: 'Sort order (ASC or DESC)', required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
