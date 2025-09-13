import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto, UserResponseDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { USER_QUERIES, buildUpdateQuery } from './sql-queries';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.dataSource.query(
      USER_QUERIES.CHECK_USER_EXISTS,
      [registerDto.email]
    );

    if (existingUser.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Insert new user
    const result = await this.dataSource.query(
      USER_QUERIES.INSERT_USER,
      [
        registerDto.email,
        hashedPassword,
        registerDto.firstName || null,
        registerDto.lastName || null,
        true
      ]
    );

    const savedUser = result[0];
    return this.transformToUserResponse(savedUser);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: UserResponseDto }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: this.transformToUserResponse(user),
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const users = await this.dataSource.query(
      USER_QUERIES.GET_USER_BY_EMAIL,
      [email]
    );
    
    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      return user;
    }
    
    return null;
  }

  async findById(id: string): Promise<User | null> {
    const users = await this.dataSource.query(
      USER_QUERIES.GET_USER_BY_ID,
      [id]
    );
    
    return users.length > 0 ? users[0] : null;
  }

  transformToUserResponse(user: any): UserResponseDto {
    const { password, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }

  // Additional CRUD methods using raw SQL

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.dataSource.query(USER_QUERIES.GET_ALL_USERS);
    return users.map(user => this.transformToUserResponse(user));
  }

  async update(id: string, updateData: Partial<RegisterDto>): Promise<UserResponseDto | null> {
    // Check if user exists
    const existingUser = await this.dataSource.query(
      USER_QUERIES.CHECK_USER_EXISTS,
      [id]
    );

    if (existingUser.length === 0) {
      return null;
    }

    // Build dynamic update query
    const { updateFields, values } = buildUpdateQuery(updateData);

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    // Add id to values array
    values.push(id);

    const result = await this.dataSource.query(
      USER_QUERIES.UPDATE_USER(updateFields),
      values
    );

    return result.length > 0 ? this.transformToUserResponse(result[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      USER_QUERIES.DELETE_USER,
      [id]
    );
    
    return result.length > 0;
  }

  async deactivate(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      USER_QUERIES.DEACTIVATE_USER,
      [id]
    );
    
    return result.length > 0;
  }

  async activate(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      USER_QUERIES.ACTIVATE_USER,
      [id]
    );
    
    return result.length > 0;
  }

  // Additional advanced CRUD methods

  async searchUsersByEmail(emailPattern: string): Promise<UserResponseDto[]> {
    const users = await this.dataSource.query(
      USER_QUERIES.SEARCH_USERS_BY_EMAIL,
      [`%${emailPattern}%`]
    );
    return users.map(user => this.transformToUserResponse(user));
  }

  async getUsersPaginated(page: number = 1, limit: number = 10): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    
    const [users, countResult] = await Promise.all([
      this.dataSource.query(USER_QUERIES.GET_USERS_PAGINATED, [limit, offset]),
      this.dataSource.query(USER_QUERIES.COUNT_USERS)
    ]);

    const total = parseInt(countResult[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map(user => this.transformToUserResponse(user)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async getActiveUsers(): Promise<UserResponseDto[]> {
    const users = await this.dataSource.query(USER_QUERIES.GET_ACTIVE_USERS);
    return users.map(user => this.transformToUserResponse(user));
  }

  async bulkUpdateStatus(userIds: string[], isActive: boolean): Promise<{ success: boolean; updatedCount: number }> {
    if (userIds.length === 0) {
      return { success: false, updatedCount: 0 };
    }

    const placeholders = userIds.map((_, index) => `$${index + 2}`).join(',');
    const query = `
      UPDATE users 
      SET "isActive" = $1, "updatedAt" = NOW() 
      WHERE id IN (${placeholders})
      RETURNING id
    `;

    const result = await this.dataSource.query(query, [isActive, ...userIds]);
    
    return {
      success: true,
      updatedCount: result.length
    };
  }
}
