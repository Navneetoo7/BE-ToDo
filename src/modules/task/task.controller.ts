import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, TaskResponseDto } from './DTOs';
import { plainToInstance } from 'class-transformer';
import { successHandler, errorHandler } from 'src/common/function';
import { UpdateTaskStatusDto } from './DTOs/update-task-status.dto';
import { AuthGuard } from 'src/guard';

@ApiTags('Tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'tasks', version: '1' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      const task = await this.taskService.create(createTaskDto);
      const res = plainToInstance(TaskResponseDto, task, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return successHandler(res, 'Task created successfully');
    } catch (e) {
      errorHandler(e);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiResponse({ status: 200, type: [TaskResponseDto] })
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      const tasks = await this.taskService.findAll(page, limit);
      const res = plainToInstance(TaskResponseDto, tasks, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return successHandler(res, 'Tasks retrieved successfully');
    } catch (e) {
      errorHandler(e);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const task = await this.taskService.findOne(id);
      const res = plainToInstance(TaskResponseDto, task, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return successHandler(res, 'Task retrieved successfully');
    } catch (e) {
      errorHandler(e);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.taskService.delete(id);
      return successHandler({}, 'Task deleted successfully');
    } catch (e) {
      errorHandler(e);
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully.',
    type: TaskResponseDto,
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    try {
      const task = await this.taskService.updateStatus(
        id,
        updateTaskStatusDto.status,
      );
      return successHandler(task, 'Task status updated successfully');
    } catch (e) {
      errorHandler(e);
    }
  }
}
