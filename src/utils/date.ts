// 时间处理工具函数
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 配置 dayjs
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化日期
 * @param date 日期对象或日期字符串
 * @param format 格式化字符串，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

/**
 * 格式化时间戳为相对时间
 * @param timestamp 时间戳或日期对象
 * @returns 相对时间字符串
 */
export function formatRelativeTime(timestamp: number | Date): string {
  return dayjs(timestamp).fromNow();
}

/**
 * 获取两个日期之间的天数差
 * @param start 开始日期
 * @param end 结束日期
 * @returns 天数差
 */
export function getDaysDiff(start: Date | string | number, end: Date | string | number): number {
  const startDate = dayjs(start).startOf('day');
  const endDate = dayjs(end).startOf('day');
  return endDate.diff(startDate, 'day');
}

/**
 * 检查日期是否在指定范围内
 * @param date 要检查的日期
 * @param start 开始日期
 * @param end 结束日期
 * @returns 是否在范围内
 */
export function isDateInRange(date: Date | string | number, start: Date | string | number, end: Date | string | number): boolean {
  const checkDate = dayjs(date);
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  return checkDate.isAfter(startDate) && checkDate.isBefore(endDate) || checkDate.isSame(startDate) || checkDate.isSame(endDate);
}

/**
 * 获取指定月份的天数
 * @param year 年份
 * @param month 月份（1-12）
 * @returns 天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}

/**
 * 获取当前月份的第一天
 * @param date 日期对象，默认为当前日期
 * @returns 第一天的日期对象
 */
export function getFirstDayOfMonth(date: Date = new Date()): Date {
  return dayjs(date).startOf('month').toDate();
}

/**
 * 获取当前月份的最后一天
 * @param date 日期对象，默认为当前日期
 * @returns 最后一天的日期对象
 */
export function getLastDayOfMonth(date: Date = new Date()): Date {
  return dayjs(date).endOf('month').toDate();
}
