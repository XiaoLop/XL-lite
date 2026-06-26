import { Injectable } from '@nestjs/common';
import { TaskStrategy } from './task-strategy.interface';

@Injectable()
export class TaskStrategyRegistry {
    private strategies = new Map<string, TaskStrategy>();

    register(strategy: TaskStrategy) {
        this.strategies.set(strategy.taskName, strategy);
    }

    get(name: string): TaskStrategy {
        const s = this.strategies.get(name);
        if (!s) throw new Error(`策略未找到: ${name}`);
        return s;
    }
}
