import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { TaskTrigger } from './trigger/task-trigger.service';
import { TaskWorker } from './executor/task-worker.service';

import { TaskService } from './task.service';

// 策略
import { TaskStrategyRegistry } from './strategies/task-strategy.registry';

@Module({
    imports: [BullModule.registerQueue({ name: 'tasks' })],
    providers: [TaskTrigger, TaskWorker, TaskService, TaskStrategyRegistry],
})
export class TasksModule {}
