import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from 'src/database/task/task.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), UserModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
