export class StringUtils {
  /**
   * Capitalize first letter of string
   */
  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Capitalize first letter of each word
   */
  static capitalizeWords(str: string): string {
    if (!str) return str;
    return str.split(' ').map(word => this.capitalize(word)).join(' ');
  }

  /**
   * Convert string to camelCase
   */
  static toCamelCase(str: string): string {
    if (!str) return str;
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * Convert string to PascalCase
   */
  static toPascalCase(str: string): string {
    if (!str) return str;
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, word => {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * Convert string to kebab-case
   */
  static toKebabCase(str: string): string {
    if (!str) return str;
    return str.replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/[\s_]+/g, '-')
              .toLowerCase();
  }

  /**
   * Convert string to snake_case
   */
  static toSnakeCase(str: string): string {
    if (!str) return str;
    return str.replace(/([a-z])([A-Z])/g, '$1_$2')
              .replace(/[\s-]+/g, '_')
              .toLowerCase();
  }

  /**
   * Convert string to title case
   */
  static toTitleCase(str: string): string {
    if (!str) return str;
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  /**
   * Truncate string to specified length
   */
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  }

  /**
   * Truncate string to specified length at word boundary
   */
  static truncateWords(str: string, length: number, suffix: string = '...'): string {
    if (!str || str.length <= length) return str;
    
    const truncated = str.substring(0, length);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + suffix;
    }
    
    return truncated + suffix;
  }

  /**
   * Remove HTML tags from string
   */
  static stripHtml(html: string): string {
    if (!html) return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  /**
   * Escape HTML special characters
   */
  static escapeHtml(str: string): string {
    if (!str) return str;
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return str.replace(/[&<>"'/]/g, s => map[s]);
  }

  /**
   * Unescape HTML special characters
   */
  static unescapeHtml(str: string): string {
    if (!str) return str;
    const map: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/'
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, s => map[s]);
  }

  /**
   * Generate random string
   */
  static random(length: number = 10, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Generate UUID v4
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Generate slug from string
   */
  static slug(str: string): string {
    if (!str) return str;
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Check if string is empty or whitespace
   */
  static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Check if string is not empty
   */
  static isNotEmpty(str: string): boolean {
    return !this.isEmpty(str);
  }

  /**
   * Check if string is email
   */
  static isEmail(str: string): boolean {
    if (!str) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  }

  /**
   * Check if string is URL
   */
  static isUrl(str: string): boolean {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if string is phone number
   */
  static isPhoneNumber(str: string): boolean {
    if (!str) return false;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(str.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Check if string is numeric
   */
  static isNumeric(str: string): boolean {
    if (!str) return false;
    return !isNaN(Number(str)) && !isNaN(parseFloat(str));
  }

  /**
   * Check if string is integer
   */
  static isInteger(str: string): boolean {
    if (!str) return false;
    return Number.isInteger(Number(str));
  }

  /**
   * Check if string is valid JSON
   */
  static isJson(str: string): boolean {
    if (!str) return false;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Format phone number
   */
  static formatPhoneNumber(phone: string, format: string = '(XXX) XXX-XXXX'): string {
    if (!phone) return phone;
    
    const cleaned = phone.replace(/\D/g, '');
    let formatted = format;
    
    for (let i = 0; i < cleaned.length; i++) {
      formatted = formatted.replace('X', cleaned[i]);
    }
    
    return formatted.replace(/X/g, '');
  }

  /**
   * Format credit card number
   */
  static formatCreditCard(cardNumber: string, separator: string = ' '): string {
    if (!cardNumber) return cardNumber;
    
    const cleaned = cardNumber.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(separator);
  }

  /**
   * Mask sensitive information
   */
  static mask(str: string, visibleChars: number = 4, maskChar: string = '*'): string {
    if (!str || str.length <= visibleChars) return str;
    
    const visible = str.slice(-visibleChars);
    const masked = maskChar.repeat(str.length - visibleChars);
    return masked + visible;
  }

  /**
   * Mask email
   */
  static maskEmail(email: string): string {
    if (!email || !this.isEmail(email)) return email;
    
    const [localPart, domain] = email.split('@');
    const maskedLocal = this.mask(localPart, 2);
    return `${maskedLocal}@${domain}`;
  }

  /**
   * Mask phone number
   */
  static maskPhone(phone: string): string {
    if (!phone) return phone;
    
    const cleaned = phone.replace(/\D/g, '');
    return this.mask(cleaned, 4);
  }

  /**
   * Remove accents from string
   */
  static removeAccents(str: string): string {
    if (!str) return str;
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Count words in string
   */
  static countWords(str: string): number {
    if (!str) return 0;
    return str.trim().split(/\s+/).length;
  }

  /**
   * Count characters in string
   */
  static countCharacters(str: string): number {
    return str ? str.length : 0;
  }

  /**
   * Count lines in string
   */
  static countLines(str: string): number {
    if (!str) return 0;
    return str.split('\n').length;
  }

  /**
   * Reverse string
   */
  static reverse(str: string): string {
    if (!str) return str;
    return str.split('').reverse().join('');
  }

  /**
   * Check if string is palindrome
   */
  static isPalindrome(str: string): boolean {
    if (!str) return true;
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === this.reverse(cleaned);
  }

  /**
   * Get initials from name
   */
  static getInitials(name: string, maxInitials: number = 2): string {
    if (!name) return '';
    
    const words = name.trim().split(/\s+/);
    const initials = words.slice(0, maxInitials).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
  }

  /**
   * Convert string to array of characters
   */
  static toArray(str: string): string[] {
    return str ? str.split('') : [];
  }

  /**
   * Join array of strings
   */
  static join(array: string[], separator: string = ''): string {
    return array ? array.join(separator) : '';
  }

  /**
   * Split string by delimiter
   */
  static split(str: string, delimiter: string | RegExp): string[] {
    return str ? str.split(delimiter) : [];
  }

  /**
   * Replace all occurrences
   */
  static replaceAll(str: string, search: string, replacement: string): string {
    if (!str) return str;
    return str.split(search).join(replacement);
  }

  /**
   * Remove duplicate characters
   */
  static removeDuplicates(str: string): string {
    if (!str) return str;
    return [...new Set(str.split(''))].join('');
  }

  /**
   * Sort characters in string
   */
  static sort(str: string): string {
    if (!str) return str;
    return str.split('').sort().join('');
  }

  /**
   * Check if string contains only letters
   */
  static isAlpha(str: string): boolean {
    if (!str) return false;
    return /^[a-zA-Z]+$/.test(str);
  }

  /**
   * Check if string contains only digits
   */
  static isDigit(str: string): boolean {
    if (!str) return false;
    return /^\d+$/.test(str);
  }

  /**
   * Check if string contains only alphanumeric characters
   */
  static isAlphanumeric(str: string): boolean {
    if (!str) return false;
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  /**
   * Check if string is valid password
   */
  static isValidPassword(password: string, minLength: number = 8): boolean {
    if (!password || password.length < minLength) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  /**
   * Generate password
   */
  static generatePassword(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return this.random(length, charset);
  }

  /**
   * Check if string starts with substring
   */
  static startsWith(str: string, prefix: string): boolean {
    if (!str || !prefix) return false;
    return str.startsWith(prefix);
  }

  /**
   * Check if string ends with substring
   */
  static endsWith(str: string, suffix: string): boolean {
    if (!str || !suffix) return false;
    return str.endsWith(suffix);
  }

  /**
   * Check if string contains substring
   */
  static contains(str: string, substring: string): boolean {
    if (!str || !substring) return false;
    return str.includes(substring);
  }

  /**
   * Find all occurrences of substring
   */
  static findAll(str: string, substring: string): number[] {
    if (!str || !substring) return [];
    
    const indices: number[] = [];
    let index = str.indexOf(substring);
    
    while (index !== -1) {
      indices.push(index);
      index = str.indexOf(substring, index + 1);
    }
    
    return indices;
  }

  /**
   * Get substring between two strings
   */
  static between(str: string, start: string, end: string): string {
    if (!str || !start || !end) return '';
    
    const startIndex = str.indexOf(start);
    if (startIndex === -1) return '';
    
    const endIndex = str.indexOf(end, startIndex + start.length);
    if (endIndex === -1) return '';
    
    return str.substring(startIndex + start.length, endIndex);
  }

  /**
   * Pad string to specified length
   */
  static pad(str: string, length: number, padString: string = ' ', direction: 'left' | 'right' | 'both' = 'right'): string {
    if (!str || str.length >= length) return str;
    
    const padLength = length - str.length;
    const pad = padString.repeat(padLength);
    
    switch (direction) {
      case 'left':
        return pad + str;
      case 'right':
        return str + pad;
      case 'both':
        const leftPad = Math.floor(padLength / 2);
        const rightPad = padLength - leftPad;
        return pad.slice(0, leftPad) + str + pad.slice(0, rightPad);
      default:
        return str;
    }
  }

  /**
   * Remove leading/trailing whitespace
   */
  static trim(str: string): string {
    return str ? str.trim() : '';
  }

  /**
   * Remove leading whitespace
   */
  static trimStart(str: string): string {
    return str ? str.trimStart() : '';
  }

  /**
   * Remove trailing whitespace
   */
  static trimEnd(str: string): string {
    return str ? str.trimEnd() : '';
  }
}