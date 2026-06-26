import { Injectable } from '@nestjs/common';
import type { Task } from './types/task.type';

@Injectable()
export class TaskService {
    constructor() {}

    // 获取所有ApiConfig的同步任务
    async getSyncApiTasks(): Promise<Task<unknown>[]> {
        await Promise.resolve();
        return [];
    }
}
