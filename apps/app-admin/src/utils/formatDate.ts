import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

/**
 * 日期格式枚举
 */
export enum DateFormat {
  /** YYYY-MM-DD */
  Date = 'YYYY-MM-DD',
  /** YYYY-MM-DD HH:mm:ss */
  DateTime = 'YYYY-MM-DD HH:mm:ss',
  /** YYYY-MM-DD HH:mm */
  DateTimeMinute = 'YYYY-MM-DD HH:mm',
  /** HH:mm:ss */
  Time = 'HH:mm:ss',
  /** HH:mm */
  TimeMinute = 'HH:mm',
  /** YYYY年MM月DD日 */
  DateCN = 'YYYY年MM月DD日',
  /** YYYY年MM月DD日 HH:mm:ss */
  DateTimeCN = 'YYYY年MM月DD日 HH:mm:ss',
  /** YYYY/MM/DD */
  DateSlash = 'YYYY/MM/DD',
  /** YYYY-MM */
  YearMonth = 'YYYY-MM',
  /** MM-DD */
  MonthDay = 'MM-DD',
}

/**
 * 将日期转换为指定格式的字符串
 * @param value - 日期值（Date、字符串、数字时间戳）
 * @param format - 目标格式，默认为 DateFormat.DateTime
 * @returns 格式化后的字符串，无效日期返回空字符串
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  format: DateFormat | string = DateFormat.DateTime,
): string {
  if (!value) return '';
  const d = dayjs(value);
  return d.isValid() ? d.format(format) : '';
}

/**
 * 获取相对时间描述（如"刚刚"、"1小时前"、"2天前"等）
 * @param value - 日期值
 * @returns 相对时间字符串，无效日期返回空字符串
 */
export function fromNow(value: Date | string | number | null | undefined): string {
  if (!value) return '';
  const d = dayjs(value);
  return d.isValid() ? d.fromNow() : '';
}

/**
 * 将日期转换为时间戳（毫秒）
 * @param value - 日期值
 * @returns 毫秒时间戳，无效日期返回 NaN
 */
export function toTimestamp(value: Date | string | number | null | undefined): number {
  if (!value) return NaN;
  const d = dayjs(value);
  return d.isValid() ? d.valueOf() : NaN;
}

/**
 * 将日期转换为秒级时间戳
 * @param value - 日期值
 * @returns 秒时间戳，无效日期返回 NaN
 */
export function toSecondTimestamp(value: Date | string | number | null | undefined): number {
  const ts = toTimestamp(value);
  return Number.isNaN(ts) ? NaN : Math.floor(ts / 1000);
}

/**
 * 解析日期字符串为 Date 对象
 * @param value - 日期字符串或时间戳
 * @returns Date 对象，无效日期返回 null
 */
export function parseDate(value: string | number | null | undefined): Date | null {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d.toDate() : null;
}

/**
 * 判断是否为有效日期
 * @param value - 待判断的值
 * @returns 是否有效
 */
export function isValidDate(value: unknown): boolean {
  if (!value) return false;
  return dayjs(value as any).isValid();
}

/**
 * 获取日期范围的起止时间（针对查询场景）
 * @param type - 范围类型
 * @param options - 配置项
 * @returns [start, end] 两个格式化后的字符串
 */
export function getDateRange(
  type: 'today' | 'yesterday' | 'week' | 'lastWeek' | 'month' | 'lastMonth' | 'year' | 'lastYear',
  options: { format?: DateFormat | string; includeTime?: boolean } = {},
): [string, string] {
  const { format = DateFormat.DateTime, includeTime = true } = options;
  const now = dayjs();
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  switch (type) {
    case 'today':
      start = now.startOf('day');
      end = now.endOf('day');
      break;
    case 'yesterday':
      start = now.subtract(1, 'day').startOf('day');
      end = now.subtract(1, 'day').endOf('day');
      break;
    case 'week':
      start = now.startOf('week');
      end = now.endOf('week');
      break;
    case 'lastWeek':
      start = now.subtract(1, 'week').startOf('week');
      end = now.subtract(1, 'week').endOf('week');
      break;
    case 'month':
      start = now.startOf('month');
      end = now.endOf('month');
      break;
    case 'lastMonth':
      start = now.subtract(1, 'month').startOf('month');
      end = now.subtract(1, 'month').endOf('month');
      break;
    case 'year':
      start = now.startOf('year');
      end = now.endOf('year');
      break;
    case 'lastYear':
      start = now.subtract(1, 'year').startOf('year');
      end = now.subtract(1, 'year').endOf('year');
      break;
    default:
      start = now;
      end = now;
  }

  if (!includeTime) {
    return [start.format(DateFormat.Date), end.format(DateFormat.Date)];
  }

  return [start.format(format), end.format(format)];
}

/**
 * 计算两个日期之间的时间差
 * @param start - 开始日期
 * @param end - 结束日期，默认为当前时间
 * @param unit - 返回单位，默认毫秒
 * @returns 时间差数值，无效日期返回 NaN
 */
export function dateDiff(
  start: Date | string | number,
  end: Date | string | number = new Date(),
  unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years' = 'milliseconds',
): number {
  const s = dayjs(start);
  const e = dayjs(end);
  if (!s.isValid() || !e.isValid()) return NaN;
  return e.diff(s, unit);
}

/**
 * 日期加减运算
 * @param value - 基础日期
 * @param amount - 数量
 * @param unit - 单位
 * @returns 运算后的 Date 对象，无效日期返回 null
 */
export function dateAdd(
  value: Date | string | number,
  amount: number,
  unit: dayjs.ManipulateType = 'day',
): Date | null {
  const d = dayjs(value);
  if (!d.isValid()) return null;
  return d.add(amount, unit).toDate();
}

/**
 * 获取指定日期所在月份的天数
 * @param value - 日期值
 * @returns 天数，无效日期返回 NaN
 */
export function getDaysInMonth(value: Date | string | number | null | undefined): number {
  if (!value) return NaN;
  const d = dayjs(value);
  return d.isValid() ? d.daysInMonth() : NaN;
}

/**
 * 获取指定日期是星期几（中文）
 * @param value - 日期值
 * @returns 星期几（一、二...日），无效日期返回空字符串
 */
export function getWeekDay(value: Date | string | number | null | undefined): string {
  if (!value) return '';
  const d = dayjs(value);
  if (!d.isValid()) return '';
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${weekDays[d.day()]}`;
}

/**
 * 格式化日期范围（用于查询表单等场景）
 * 自动补全起止时间的时分秒（开始为 00:00:00，结束为 23:59:59）
 * @param range - [开始, 结束] 日期字符串数组
 * @param format - 输出格式
 * @returns [start, end] 或 null
 */
export function normalizeDateRange(
  range: [string | null | undefined, string | null | undefined] | null | undefined,
  format: DateFormat | string = DateFormat.DateTime,
): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null;
  const start = dayjs(range[0]).startOf('day').format(format);
  const end = dayjs(range[1]).endOf('day').format(format);
  return [start, end];
}
