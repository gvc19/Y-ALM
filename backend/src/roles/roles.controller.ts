import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { RoleQueryDto } from './dto/role-query.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Role name already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for role name' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC or DESC)' })
  async findAll(@Query() queryDto: RoleQueryDto) {
    return this.rolesService.findAll(queryDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active roles' })
  @ApiResponse({
    status: 200,
    description: 'Active roles retrieved successfully',
    type: [RoleResponseDto],
  })
  async getActiveRoles(): Promise<RoleResponseDto[]> {
    return this.rolesService.getActiveRoles();
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Get all deleted roles' })
  @ApiResponse({
    status: 200,
    description: 'Deleted roles retrieved successfully',
    type: [RoleResponseDto],
  })
  async getDeletedRoles(): Promise<RoleResponseDto[]> {
    return this.rolesService.getDeletedRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Role name already exists',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete role by ID' })
  @ApiResponse({
    status: 204,
    description: 'Role deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete role by ID' })
  @ApiResponse({
    status: 204,
    description: 'Role permanently deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  async hardDelete(@Param('id') id: string): Promise<void> {
    return this.rolesService.hardDelete(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role activated successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  async activate(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.rolesService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role deactivated successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  async deactivate(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.rolesService.deactivate(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore deleted role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role restored successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Deleted role not found',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  async restore(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.rolesService.restore(id);
  }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk update role status' })
  @ApiResponse({
    status: 200,
    description: 'Role statuses updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'No role IDs provided',
  })
  async bulkUpdateStatus(
    @Body() body: { ids: string[]; isActive: boolean },
  ): Promise<{ success: boolean; updatedCount: number }> {
    return this.rolesService.bulkUpdateStatus(body.ids, body.isActive);
  }
}
