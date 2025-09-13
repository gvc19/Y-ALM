import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserRoleMapping } from './entities/user-role-mapping.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UserRoleResponseDto } from './dto/user-role-response.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRoleMapping)
    private userRoleMappingRepository: Repository<UserRoleMapping>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async assignRole(userId: string, assignRoleDto: AssignRoleDto): Promise<UserRoleResponseDto> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: assignRoleDto.roleId, isDeleted: false }
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${assignRoleDto.roleId} not found`);
    }

    // Check if assignment already exists
    const existingAssignment = await this.userRoleMappingRepository.findOne({
      where: { userId, roleId: assignRoleDto.roleId, isDeleted: false }
    });
    if (existingAssignment) {
      throw new ConflictException('User already has this role assigned');
    }

    // Create new assignment
    const userRoleMapping = this.userRoleMappingRepository.create({
      userId,
      roleId: assignRoleDto.roleId,
      isActive: assignRoleDto.isActive ?? true,
    });

    const savedMapping = await this.userRoleMappingRepository.save(userRoleMapping);
    return this.transformToResponseDto(savedMapping, role.name);
  }

  async getUserRoles(userId: string): Promise<UserRoleResponseDto[]> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const mappings = await this.userRoleMappingRepository.find({
      where: { userId, isDeleted: false },
      relations: ['role'],
      order: { createdAt: 'DESC' }
    });

    return mappings.map(mapping => this.transformToResponseDto(mapping, mapping.role.name));
  }

  async getRoleUsers(roleId: string): Promise<UserRoleResponseDto[]> {
    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: roleId, isDeleted: false }
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const mappings = await this.userRoleMappingRepository.find({
      where: { roleId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });

    return mappings.map(mapping => this.transformToResponseDto(mapping, role.name));
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    const mapping = await this.userRoleMappingRepository.findOne({
      where: { userId, roleId, isDeleted: false }
    });

    if (!mapping) {
      throw new NotFoundException('User-role assignment not found');
    }

    // Soft delete
    mapping.isDeleted = true;
    mapping.updatedAt = new Date();
    await this.userRoleMappingRepository.save(mapping);
  }

  async updateRoleStatus(userId: string, roleId: string, isActive: boolean): Promise<UserRoleResponseDto> {
    const mapping = await this.userRoleMappingRepository.findOne({
      where: { userId, roleId, isDeleted: false },
      relations: ['role']
    });

    if (!mapping) {
      throw new NotFoundException('User-role assignment not found');
    }

    mapping.isActive = isActive;
    mapping.updatedAt = new Date();
    const updatedMapping = await this.userRoleMappingRepository.save(mapping);
    return this.transformToResponseDto(updatedMapping, mapping.role.name);
  }

  async bulkAssignRoles(userId: string, roleIds: string[]): Promise<{ success: boolean; assignedCount: number }> {
    if (roleIds.length === 0) {
      throw new BadRequestException('No role IDs provided');
    }

    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if all roles exist
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds), isDeleted: false }
    });
    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    // Get existing assignments
    const existingMappings = await this.userRoleMappingRepository.find({
      where: { userId, roleId: In(roleIds), isDeleted: false }
    });
    const existingRoleIds = existingMappings.map(m => m.roleId);

    // Filter out already assigned roles
    const newRoleIds = roleIds.filter(roleId => !existingRoleIds.includes(roleId));

    if (newRoleIds.length === 0) {
      return { success: true, assignedCount: 0 };
    }

    // Create new assignments
    const newMappings = newRoleIds.map(roleId => 
      this.userRoleMappingRepository.create({
        userId,
        roleId,
        isActive: true,
      })
    );

    await this.userRoleMappingRepository.save(newMappings);

    return {
      success: true,
      assignedCount: newMappings.length,
    };
  }

  async bulkRemoveRoles(userId: string, roleIds: string[]): Promise<{ success: boolean; removedCount: number }> {
    if (roleIds.length === 0) {
      throw new BadRequestException('No role IDs provided');
    }

    const result = await this.userRoleMappingRepository.update(
      { userId, roleId: In(roleIds), isDeleted: false },
      { isDeleted: true, updatedAt: new Date() }
    );

    return {
      success: true,
      removedCount: result.affected || 0,
    };
  }

  private transformToResponseDto(mapping: UserRoleMapping, roleName: string): UserRoleResponseDto {
    const { user, role, ...mappingWithoutRelations } = mapping;
    return {
      ...mappingWithoutRelations,
      roleName,
    } as UserRoleResponseDto;
  }
}
