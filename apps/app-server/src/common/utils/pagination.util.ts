import { Like } from 'typeorm';

// 需要排除查询的字段
export const PAGINATION_FIELDS = ['pageNum', 'pageSize', 'sort', 'order'];

/**
 * 构建查询条件
 * @param query 查询条件对象
 * @param paginationFields 排除的字段
 * @param likeFields 需要模糊匹配的字段
 * @returns 查询条件对象
 */
export function buildWhere<T extends object>(
    query: T,
    paginationFields: string[] = PAGINATION_FIELDS,
    likeFields: string[] = [],
): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(query)) {
        if (paginationFields.includes(key)) continue;
        if (value === undefined || value === null || value === '') continue;
        const conditionValue: unknown =
            likeFields.includes(key) && typeof value === 'string'
                ? Like(`%${value}%`)
                : value;
        where[key] = conditionValue;
    }
    return where;
}
