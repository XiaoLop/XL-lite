import { Between, Like } from 'typeorm';

// 需要排除查询的字段
export const PAGINATION_FIELDS = ['pageNum', 'pageSize', 'sort', 'order'];

/**
 * 构建查询条件
 * @param query 查询条件对象
 * @param paginationFields 排除的字段
 * @param likeFields 需要模糊匹配的字段
 * @param dateFields 需要按日期范围匹配的字段（值格式为 YYYY-MM-DD）
 * @returns 查询条件对象
 */
export function buildWhere<T extends object>(
    query: T,
    paginationFields: string[] = PAGINATION_FIELDS,
    likeFields: string[] = [],
    dateFields: string[] = ['createdAt', 'updatedAt'],
): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(query)) {
        if (paginationFields.includes(key)) continue;
        if (value === undefined || value === null || value === '') continue;

        let conditionValue: unknown;

        if (dateFields.includes(key) && typeof value === 'string') {
            // 按整天查询：从当天 00:00:00 到 23:59:59.999
            const start = new Date(value + 'T00:00:00.000Z');
            const end = new Date(value + 'T23:59:59.999Z');
            conditionValue = Between(start, end);
        } else if (likeFields.includes(key) && typeof value === 'string') {
            conditionValue = Like(`%${value}%`);
        } else {
            conditionValue = value;
        }

        where[key] = conditionValue;
    }
    return where;
}
