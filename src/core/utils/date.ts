export class DateUtils {
  /**
   * Format date to string
   */
  static formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
      return '';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string, format: string = 'YYYY-MM-DD'): Date | null {
    if (!dateString) return null;

    try {
      let date: Date;
      
      if (format === 'YYYY-MM-DD') {
        date = new Date(dateString);
      } else if (format === 'DD/MM/YYYY') {
        const [day, month, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else if (format === 'MM/DD/YYYY') {
        const [month, day, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(dateString);
      }

      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  static getRelativeTime(date: Date | string | number): string {
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date | string | number): boolean {
    const today = new Date();
    const target = new Date(date);
    
    return today.getFullYear() === target.getFullYear() &&
           today.getMonth() === target.getMonth() &&
           today.getDate() === target.getDate();
  }

  /**
   * Check if date is yesterday
   */
  static isYesterday(date: Date | string | number): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const target = new Date(date);
    
    return yesterday.getFullYear() === target.getFullYear() &&
           yesterday.getMonth() === target.getMonth() &&
           yesterday.getDate() === target.getDate();
  }

  /**
   * Check if date is tomorrow
   */
  static isTomorrow(date: Date | string | number): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const target = new Date(date);
    
    return tomorrow.getFullYear() === target.getFullYear() &&
           tomorrow.getMonth() === target.getMonth() &&
           tomorrow.getDate() === target.getDate();
  }

  /**
   * Get start of day
   */
  static getStartOfDay(date: Date | string | number): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get end of day
   */
  static getEndOfDay(date: Date | string | number): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /**
   * Get start of week
   */
  static getStartOfWeek(date: Date | string | number, startDay: number = 0): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day - startDay;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get end of week
   */
  static getEndOfWeek(date: Date | string | number, startDay: number = 0): Date {
    const start = this.getStartOfWeek(date, startDay);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  /**
   * Get start of month
   */
  static getStartOfMonth(date: Date | string | number): Date {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get end of month
   */
  static getEndOfMonth(date: Date | string | number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /**
   * Get start of year
   */
  static getStartOfYear(date: Date | string | number): Date {
    const d = new Date(date);
    d.setMonth(0, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get end of year
   */
  static getEndOfYear(date: Date | string | number): Date {
    const d = new Date(date);
    d.setMonth(11, 31);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /**
   * Add days to date
   */
  static addDays(date: Date | string | number, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  /**
   * Add months to date
   */
  static addMonths(date: Date | string | number, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  /**
   * Add years to date
   */
  static addYears(date: Date | string | number, years: number): Date {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return d;
  }

  /**
   * Get difference between dates in days
   */
  static getDifferenceInDays(date1: Date | string | number, date2: Date | string | number): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get difference between dates in hours
   */
  static getDifferenceInHours(date1: Date | string | number, date2: Date | string | number): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
  }

  /**
   * Get difference between dates in minutes
   */
  static getDifferenceInMinutes(date1: Date | string | number, date2: Date | string | number): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60));
  }

  /**
   * Check if date is between two dates
   */
  static isBetween(date: Date | string | number, start: Date | string | number, end: Date | string | number): boolean {
    const d = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return d >= startDate && d <= endDate;
  }

  /**
   * Get age from birth date
   */
  static getAge(birthDate: Date | string | number): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Get business days between dates
   */
  static getBusinessDays(startDate: Date | string | number, endDate: Date | string | number): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    
    while (start <= end) {
      const dayOfWeek = start.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        count++;
      }
      start.setDate(start.getDate() + 1);
    }
    
    return count;
  }

  /**
   * Get next business day
   */
  static getNextBusinessDay(date: Date | string | number): Date {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
  }

  /**
   * Get previous business day
   */
  static getPreviousBusinessDay(date: Date | string | number): Date {
    let prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    
    while (prevDay.getDay() === 0 || prevDay.getDay() === 6) {
      prevDay.setDate(prevDay.getDate() - 1);
    }
    
    return prevDay;
  }

  /**
   * Format date range
   */
  static formatDateRange(startDate: Date | string | number, endDate: Date | string | number, format: string = 'YYYY-MM-DD'): string {
    const start = this.formatDate(startDate, format);
    const end = this.formatDate(endDate, format);
    
    if (start === end) {
      return start;
    }
    
    return `${start} - ${end}`;
  }

  /**
   * Get timezone offset in minutes
   */
  static getTimezoneOffset(date: Date | string | number = new Date()): number {
    return new Date(date).getTimezoneOffset();
  }

  /**
   * Convert to UTC
   */
  static toUTC(date: Date | string | number): Date {
    const d = new Date(date);
    return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
  }

  /**
   * Convert from UTC
   */
  static fromUTC(date: Date | string | number): Date {
    const d = new Date(date);
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
  }

  /**
   * Check if year is leap year
   */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Get days in month
   */
  static getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  /**
   * Get week number
   */
  static getWeekNumber(date: Date | string | number): number {
    const d = new Date(date);
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }

  /**
   * Get quarter
   */
  static getQuarter(date: Date | string | number): number {
    const month = new Date(date).getMonth();
    return Math.floor(month / 3) + 1;
  }
}

