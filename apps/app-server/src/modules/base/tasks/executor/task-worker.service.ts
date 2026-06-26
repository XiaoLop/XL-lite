import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Worker } from 'bullmq';
import { TaskStrategyRegistry } from '../strategies/task-strategy.registry';
import { Task } from '../types/task.type';

@Injectable()
export class TaskWorker implements OnModuleInit, OnModuleDestroy {
    private worker: Worker | null = null;
    private readonly logger = new Logger(TaskWorker.name);

    constructor(
        private registry: TaskStrategyRegistry,
        @InjectQueue('tasks') private readonly queue: Queue,
    ) {}

    onModuleInit() {
        // 从 NestJS 管理的 Queue 中获取连接配置和 prefix
        const connection = this.queue.opts.connection;
        const prefix = this.queue.opts.prefix;

        this.worker = new Worker<Task<unknown>>(
            'tasks',
            async (job) => {
                const strategy = this.registry.get(job.name);
                await strategy.execute(job.data);
            },
            { connection, prefix }, // ← 传入 prefix 确保与 Queue 一致
        );

        this.worker.on('failed', (job, err) => {
            this.logger.error(`任务 ${job?.name} 失败: ${err.message}`);
        });
    }

    onModuleDestroy() {
        void this.worker?.close();
    }
}
