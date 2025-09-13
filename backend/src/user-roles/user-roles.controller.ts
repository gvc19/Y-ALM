import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserRolesService } from './user-roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UserRoleResponseDto } from './dto/user-role-response.dto';

@ApiTags('User Roles')
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post('users/:userId/roles')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({
    status: 201,
    description: 'Role assigned successfully',
    type: UserRoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User or role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User already has this role assigned',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async assignRole(
    @Param('userId') userId: string,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<UserRoleResponseDto> {
    return this.userRolesService.assignRole(userId, assignRoleDto);
  }

  @Get('users/:userId/roles')
  @ApiOperation({ summary: 'Get user roles' })
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved successfully',
    type: [UserRoleResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getUserRoles(@Param('userId') userId: string): Promise<UserRoleResponseDto[]> {
    return this.userRolesService.getUserRoles(userId);
  }

  @Get('roles/:roleId/users')
  @ApiOperation({ summary: 'Get users with specific role' })
  @ApiResponse({
    status: 200,
    description: 'Role users retrieved successfully',
    type: [UserRoleResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  async getRoleUsers(@Param('roleId') roleId: string): Promise<UserRoleResponseDto[]> {
    return this.userRolesService.getRoleUsers(roleId);
  }

  @Delete('users/:userId/roles/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({
    status: 204,
    description: 'Role removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User-role assignment not found',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<void> {
    return this.userRolesService.removeRole(userId, roleId);
  }

  @Patch('users/:userId/roles/:roleId/status')
  @ApiOperation({ summary: 'Update user role status' })
  @ApiResponse({
    status: 200,
    description: 'Role status updated successfully',
    type: UserRoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User-role assignment not found',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  async updateRoleStatus(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @Body() body: { isActive: boolean },
  ): Promise<UserRoleResponseDto> {
    return this.userRolesService.updateRoleStatus(userId, roleId, body.isActive);
  }

  @Post('users/:userId/roles/bulk')
  @ApiOperation({ summary: 'Bulk assign roles to user' })
  @ApiResponse({
    status: 201,
    description: 'Roles assigned successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User or one or more roles not found',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async bulkAssignRoles(
    @Param('userId') userId: string,
    @Body() body: { roleIds: string[] },
  ): Promise<{ success: boolean; assignedCount: number }> {
    return this.userRolesService.bulkAssignRoles(userId, body.roleIds);
  }

  @Delete('users/:userId/roles/bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Bulk remove roles from user' })
  @ApiResponse({
    status: 204,
    description: 'Roles removed successfully',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async bulkRemoveRoles(
    @Param('userId') userId: string,
    @Body() body: { roleIds: string[] },
  ): Promise<{ success: boolean; removedCount: number }> {
    return this.userRolesService.bulkRemoveRoles(userId, body.roleIds);
  }
}
