import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from 'src/database/task/task.entity';
import { CreateTaskDto } from './DTOs';
import { TaskStatus } from './enums';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) { }

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskEntity> {
    const task = this.taskRepository.create(createTaskDto);
    task.user = { id: userId } as any;
    return this.taskRepository.save(task);
  }

  async findAll(page: number, limit: number): Promise<TaskEntity[]> {
    const skip = (page - 1) * limit;
    return this.taskRepository.find({
      skip,
      take: limit,
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    task.deletedAt = new Date();
    await this.taskRepository.save(task);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found or already deleted`,
      );
    }
    task.status = status;
    return this.taskRepository.save(task);
  }
}
