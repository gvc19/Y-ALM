import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { RoleQueryDto } from './dto/role-query.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    // Check if role name already exists
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name }
    });
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    // Create new role
    const role = this.roleRepository.create(createRoleDto);
    const savedRole = await this.roleRepository.save(role);
    return this.transformToResponseDto(savedRole);
  }

  async findAll(queryDto: RoleQueryDto): Promise<{ roles: RoleResponseDto[]; total: number; page: number; limit: number; totalPages: number }> {
    const { search, isActive, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;
    
    const options: FindManyOptions<Role> = {
      where: {},
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    };

    // Add search conditions
    if (search) {
      options.where = { name: Like(`%${search}%`) };
    }

    // Add active status filter
    if (isActive !== undefined) {
      options.where = { ...options.where, isActive };
    }

    // Exclude deleted roles
    options.where = { ...options.where, isDeleted: false };

    const [roles, total] = await this.roleRepository.findAndCount(options);
    const totalPages = Math.ceil(total / limit);

    return {
      roles: roles.map(role => this.transformToResponseDto(role)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return this.transformToResponseDto(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Check for name conflict if name is being updated
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name }
      });
      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    // Update role
    Object.assign(role, {
      ...updateRoleDto,
      updatedAt: new Date(),
    });

    const updatedRole = await this.roleRepository.save(role);
    return this.transformToResponseDto(updatedRole);
  }

  async remove(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Soft delete
    role.isDeleted = true;
    role.updatedAt = new Date();
    await this.roleRepository.save(role);
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async activate(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    role.isActive = true;
    role.updatedAt = new Date();
    const updatedRole = await this.roleRepository.save(role);
    return this.transformToResponseDto(updatedRole);
  }

  async deactivate(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    role.isActive = false;
    role.updatedAt = new Date();
    const updatedRole = await this.roleRepository.save(role);
    return this.transformToResponseDto(updatedRole);
  }

  async getActiveRoles(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find({
      where: { isActive: true, isDeleted: false },
      order: { createdAt: 'DESC' }
    });

    return roles.map(role => this.transformToResponseDto(role));
  }

  async getDeletedRoles(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find({
      where: { isDeleted: true },
      order: { updatedAt: 'DESC' }
    });

    return roles.map(role => this.transformToResponseDto(role));
  }

  async restore(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id, isDeleted: true }
    });

    if (!role) {
      throw new NotFoundException(`Deleted role with ID ${id} not found`);
    }

    role.isDeleted = false;
    role.updatedAt = new Date();
    const restoredRole = await this.roleRepository.save(role);
    return this.transformToResponseDto(restoredRole);
  }

  async bulkUpdateStatus(ids: string[], isActive: boolean): Promise<{ success: boolean; updatedCount: number }> {
    if (ids.length === 0) {
      throw new BadRequestException('No role IDs provided');
    }

    const result = await this.roleRepository.update(
      { id: In(ids), isDeleted: false },
      { isActive, updatedAt: new Date() }
    );

    return {
      success: true,
      updatedCount: result.affected || 0,
    };
  }

  private transformToResponseDto(role: Role): RoleResponseDto {
    const { userRoleMappings, ...roleWithoutMappings } = role;
    return roleWithoutMappings as RoleResponseDto;
  }
}
