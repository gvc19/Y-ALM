import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, In } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if username already exists
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username }
    });
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : undefined,
    });

    const savedUser = await this.userRepository.save(user);
    return this.transformToResponseDto(savedUser);
  }

  async findAll(queryDto: UserQueryDto): Promise<{ users: UserResponseDto[]; total: number; page: number; limit: number; totalPages: number }> {
    const { search, isActive, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;
    
    const options: FindManyOptions<User> = {
      where: {},
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    };

    // Add search conditions
    if (search) {
      options.where = [
        { username: Like(`%${search}%`) },
        { firstName: Like(`%${search}%`) },
        { lastName: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
      ];
    }

    // Add active status filter
    if (isActive !== undefined) {
      if (Array.isArray(options.where)) {
        options.where = options.where.map(condition => ({ ...condition, isActive }));
      } else {
        options.where = { ...options.where, isActive };
      }
    }

    // Exclude deleted users
    if (Array.isArray(options.where)) {
      options.where = options.where.map(condition => ({ ...condition, isDeleted: false }));
    } else {
      options.where = { ...options.where, isDeleted: false };
    }

    const [users, total] = await this.userRepository.findAndCount(options);
    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map(user => this.transformToResponseDto(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.transformToResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check for username conflict if username is being updated
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username }
      });
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    // Check for email conflict if email is being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update user
    Object.assign(user, {
      ...updateUserDto,
      dateOfBirth: updateUserDto.dateOfBirth ? new Date(updateUserDto.dateOfBirth) : user.dateOfBirth,
      updatedAt: new Date(),
    });

    const updatedUser = await this.userRepository.save(user);
    return this.transformToResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Soft delete
    user.isDeleted = true;
    user.updatedAt = new Date();
    await this.userRepository.save(user);
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async activate(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = true;
    user.updatedAt = new Date();
    const updatedUser = await this.userRepository.save(user);
    return this.transformToResponseDto(updatedUser);
  }

  async deactivate(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = false;
    user.updatedAt = new Date();
    const updatedUser = await this.userRepository.save(user);
    return this.transformToResponseDto(updatedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, isDeleted: false }
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username, isDeleted: false }
    });
  }

  async getActiveUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { isActive: true, isDeleted: false },
      order: { createdAt: 'DESC' }
    });

    return users.map(user => this.transformToResponseDto(user));
  }

  async getDeletedUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { isDeleted: true },
      order: { updatedAt: 'DESC' }
    });

    return users.map(user => this.transformToResponseDto(user));
  }

  async restore(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: true }
    });

    if (!user) {
      throw new NotFoundException(`Deleted user with ID ${id} not found`);
    }

    user.isDeleted = false;
    user.updatedAt = new Date();
    const restoredUser = await this.userRepository.save(user);
    return this.transformToResponseDto(restoredUser);
  }

  async bulkUpdateStatus(ids: string[], isActive: boolean): Promise<{ success: boolean; updatedCount: number }> {
    if (ids.length === 0) {
      throw new BadRequestException('No user IDs provided');
    }

    const result = await this.userRepository.update(
      { id: In(ids), isDeleted: false },
      { isActive, updatedAt: new Date() }
    );

    return {
      success: true,
      updatedCount: result.affected || 0,
    };
  }

  private transformToResponseDto(user: User): UserResponseDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponseDto;
  }
}
