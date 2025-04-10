import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UserResponseDto } from './DTOs';
import { plainToInstance } from 'class-transformer';
import { errorHandler, successHandler } from 'src/common/function';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.userService.create(createUserDto);
      return successHandler(user, 'User created successfully');
    } catch (e) {
      errorHandler(e);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
    type: [UserResponseDto],
  })
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      const users = await this.userService.findAll(page, limit);
      const res = plainToInstance(UserResponseDto, users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return successHandler(res, 'Users retrieved successfully');
    } catch (e) {
      errorHandler(e);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const user = await this.userService.findOne(id);
      const res = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return successHandler(res, 'User retrieved successfully');
    } catch (e) {
      errorHandler(e);
    }
  }
}
