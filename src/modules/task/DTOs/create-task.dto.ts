import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';
import { IsValidUser } from 'src/modules/user/validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish NestJS module', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Implement DTOs and services for tasks',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-04-20T23:59:00.000Z',
    required: true,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  deadline: Date;

  @ApiProperty({
    enum: TaskStatus,
    required: false,
    default: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    enum: TaskPriority,
    required: false,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
