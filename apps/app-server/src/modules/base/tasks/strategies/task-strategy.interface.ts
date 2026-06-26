import type { Task } from '../types/task.type';

export interface TaskStrategy<T = Task<unknown>> {
    readonly taskName: string;
    execute(data: T): Promise<void>;
}
