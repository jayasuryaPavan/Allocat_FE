import { computed } from 'vue'
import { DateUtils } from '@/core/utils/date'

export function useDate() {
  /**
   * Format date using DateUtils
   */
  const formatDate = (date: Date | string | number, format: string = 'YYYY-MM-DD'): string => {
    return DateUtils.formatDate(date, format)
  }

  /**
   * Get relative time
   */
  const getRelativeTime = (date: Date | string | number): string => {
    return DateUtils.getRelativeTime(date)
  }

  /**
   * Check if date is today
   */
  const isToday = (date: Date | string | number): boolean => {
    return DateUtils.isToday(date)
  }

  /**
   * Check if date is yesterday
   */
  const isYesterday = (date: Date | string | number): boolean => {
    return DateUtils.isYesterday(date)
  }

  /**
   * Check if date is tomorrow
   */
  const isTomorrow = (date: Date | string | number): boolean => {
    return DateUtils.isTomorrow(date)
  }

  /**
   * Get age from birth date
   */
  const getAge = (birthDate: Date | string | number): number => {
    return DateUtils.getAge(birthDate)
  }

  /**
   * Get start of day
   */
  const getStartOfDay = (date: Date | string | number): Date => {
    return DateUtils.getStartOfDay(date)
  }

  /**
   * Get end of day
   */
  const getEndOfDay = (date: Date | string | number): Date => {
    return DateUtils.getEndOfDay(date)
  }

  /**
   * Get start of week
   */
  const getStartOfWeek = (date: Date | string | number, startDay: number = 0): Date => {
    return DateUtils.getStartOfWeek(date, startDay)
  }

  /**
   * Get end of week
   */
  const getEndOfWeek = (date: Date | string | number, startDay: number = 0): Date => {
    return DateUtils.getEndOfWeek(date, startDay)
  }

  /**
   * Get start of month
   */
  const getStartOfMonth = (date: Date | string | number): Date => {
    return DateUtils.getStartOfMonth(date)
  }

  /**
   * Get end of month
   */
  const getEndOfMonth = (date: Date | string | number): Date => {
    return DateUtils.getEndOfMonth(date)
  }

  /**
   * Add days to date
   */
  const addDays = (date: Date | string | number, days: number): Date => {
    return DateUtils.addDays(date, days)
  }

  /**
   * Add months to date
   */
  const addMonths = (date: Date | string | number, months: number): Date => {
    return DateUtils.addMonths(date, months)
  }

  /**
   * Add years to date
   */
  const addYears = (date: Date | string | number, years: number): Date => {
    return DateUtils.addYears(date, years)
  }

  /**
   * Get difference between dates in days
   */
  const getDifferenceInDays = (date1: Date | string | number, date2: Date | string | number): number => {
    return DateUtils.getDifferenceInDays(date1, date2)
  }

  /**
   * Get difference between dates in hours
   */
  const getDifferenceInHours = (date1: Date | string | number, date2: Date | string | number): number => {
    return DateUtils.getDifferenceInHours(date1, date2)
  }

  /**
   * Get difference between dates in minutes
   */
  const getDifferenceInMinutes = (date1: Date | string | number, date2: Date | string | number): number => {
    return DateUtils.getDifferenceInMinutes(date1, date2)
  }

  /**
   * Check if date is between two dates
   */
  const isBetween = (date: Date | string | number, start: Date | string | number, end: Date | string | number): boolean => {
    return DateUtils.isBetween(date, start, end)
  }

  /**
   * Get business days between dates
   */
  const getBusinessDays = (startDate: Date | string | number, endDate: Date | string | number): number => {
    return DateUtils.getBusinessDays(startDate, endDate)
  }

  /**
   * Get next business day
   */
  const getNextBusinessDay = (date: Date | string | number): Date => {
    return DateUtils.getNextBusinessDay(date)
  }

  /**
   * Get previous business day
   */
  const getPreviousBusinessDay = (date: Date | string | number): Date => {
    return DateUtils.getPreviousBusinessDay(date)
  }

  /**
   * Format date range
   */
  const formatDateRange = (startDate: Date | string | number, endDate: Date | string | number, format: string = 'YYYY-MM-DD'): string => {
    return DateUtils.formatDateRange(startDate, endDate, format)
  }

  /**
   * Get current date
   */
  const getCurrentDate = (): Date => {
    return new Date()
  }

  /**
   * Get current timestamp
   */
  const getCurrentTimestamp = (): number => {
    return Date.now()
  }

  /**
   * Get timezone offset
   */
  const getTimezoneOffset = (date: Date | string | number = new Date()): number => {
    return DateUtils.getTimezoneOffset(date)
  }

  /**
   * Convert to UTC
   */
  const toUTC = (date: Date | string | number): Date => {
    return DateUtils.toUTC(date)
  }

  /**
   * Convert from UTC
   */
  const fromUTC = (date: Date | string | number): Date => {
    return DateUtils.fromUTC(date)
  }

  /**
   * Check if year is leap year
   */
  const isLeapYear = (year: number): boolean => {
    return DateUtils.isLeapYear(year)
  }

  /**
   * Get days in month
   */
  const getDaysInMonth = (year: number, month: number): number => {
    return DateUtils.getDaysInMonth(year, month)
  }

  /**
   * Get week number
   */
  const getWeekNumber = (date: Date | string | number): number => {
    return DateUtils.getWeekNumber(date)
  }

  /**
   * Get quarter
   */
  const getQuarter = (date: Date | string | number): number => {
    return DateUtils.getQuarter(date)
  }

  return {
    formatDate,
    getRelativeTime,
    isToday,
    isYesterday,
    isTomorrow,
    getAge,
    getStartOfDay,
    getEndOfDay,
    getStartOfWeek,
    getEndOfWeek,
    getStartOfMonth,
    getEndOfMonth,
    addDays,
    addMonths,
    addYears,
    getDifferenceInDays,
    getDifferenceInHours,
    getDifferenceInMinutes,
    isBetween,
    getBusinessDays,
    getNextBusinessDay,
    getPreviousBusinessDay,
    formatDateRange,
    getCurrentDate,
    getCurrentTimestamp,
    getTimezoneOffset,
    toUTC,
    fromUTC,
    isLeapYear,
    getDaysInMonth,
    getWeekNumber,
    getQuarter
  }
}
