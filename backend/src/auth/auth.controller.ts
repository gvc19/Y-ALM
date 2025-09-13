import { Controller, Post, Body, Get, Put, Delete, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UserResponseDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.authService.transformToUserResponse(req.user);
  }

  // Additional CRUD endpoints

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.authService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto | null> {
    const user = await this.authService.findById(id);
    return user ? this.authService.transformToUserResponse(user) : null;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto | null> {
    return this.authService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.authService.delete(id);
    return { success };
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deactivateUser(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.authService.deactivate(id);
    return { success };
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async activateUser(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.authService.activate(id);
    return { success };
  }

  // Advanced CRUD endpoints

  @Get('search/email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search users by email pattern' })
  @ApiResponse({ status: 200, description: 'Users found successfully', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchUsersByEmail(@Query('pattern') pattern: string): Promise<UserResponseDto[]> {
    return this.authService.searchUsersByEmail(pattern);
  }

  @Get('paginated')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUsersPaginated(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.authService.getUsersPaginated(parseInt(page), parseInt(limit));
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active users only' })
  @ApiResponse({ status: 200, description: 'Active users retrieved successfully', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getActiveUsers(): Promise<UserResponseDto[]> {
    return this.authService.getActiveUsers();
  }

  @Patch('bulk/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update user status' })
  @ApiResponse({ status: 200, description: 'Users status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async bulkUpdateStatus(
    @Body() body: { userIds: string[]; isActive: boolean }
  ) {
    return this.authService.bulkUpdateStatus(body.userIds, body.isActive);
  }
}
