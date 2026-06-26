export interface Task<T> {
    taskName: string;
    intervalMinutes: number; // 运行间隔, 单位: 分钟
    lastRunTime: Date | undefined; // 上次运行时间
    meta?: T;
}
