import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { TaskService } from '../task.service';

@Injectable()
export class TaskTrigger {
    private readonly logger = new Logger(TaskTrigger.name);
    constructor(
        @InjectQueue('tasks') private taskQueue: Queue,
        private readonly taskService: TaskService,
    ) {}

    @Interval(60000) // 每分钟扫描
    async dispatch() {
        const configs = await this.taskService.getSyncApiTasks();
        this.logger.log('dispatch sync api tasks');
        const now = Date.now();
        for (const c of configs) {
            const lastRun = c.lastRunTime?.getTime() ?? 0;
            const shouldRun = now - lastRun >= c.intervalMinutes * 60000;
            // 满足执行条件
            if (shouldRun) {
                // 添加任务
                this.logger.log(`add task ${c.taskName}`);
                await this.taskQueue.add(c.taskName, c);
            }
        }
    }
}
