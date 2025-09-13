import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserQueryDto } from './dto/user-query.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for username, firstName, lastName, or email' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC or DESC)' })
  async findAll(@Query() queryDto: UserQueryDto) {
    return this.usersService.findAll(queryDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({
    status: 200,
    description: 'Active users retrieved successfully',
    type: [UserResponseDto],
  })
  async getActiveUsers(): Promise<UserResponseDto[]> {
    return this.usersService.getActiveUsers();
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Get all deleted users' })
  @ApiResponse({
    status: 200,
    description: 'Deleted users retrieved successfully',
    type: [UserResponseDto],
  })
  async getDeletedUsers(): Promise<UserResponseDto[]> {
    return this.usersService.getDeletedUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete user by ID' })
  @ApiResponse({
    status: 204,
    description: 'User permanently deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async hardDelete(@Param('id') id: string): Promise<void> {
    return this.usersService.hardDelete(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async activate(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async deactivate(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore deleted user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User restored successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Deleted user not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async restore(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.restore(id);
  }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk update user status' })
  @ApiResponse({
    status: 200,
    description: 'User statuses updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'No user IDs provided',
  })
  async bulkUpdateStatus(
    @Body() body: { ids: string[]; isActive: boolean },
  ): Promise<{ success: boolean; updatedCount: number }> {
    return this.usersService.bulkUpdateStatus(body.ids, body.isActive);
  }
}
