import { computed } from 'vue'
import { StringUtils } from '@/core/utils/string'

export function useString() {
  /**
   * Capitalize first letter of string
   */
  const capitalize = (str: string): string => {
    return StringUtils.capitalize(str)
  }

  /**
   * Capitalize first letter of each word
   */
  const capitalizeWords = (str: string): string => {
    return StringUtils.capitalizeWords(str)
  }

  /**
   * Convert string to camelCase
   */
  const toCamelCase = (str: string): string => {
    return StringUtils.toCamelCase(str)
  }

  /**
   * Convert string to PascalCase
   */
  const toPascalCase = (str: string): string => {
    return StringUtils.toPascalCase(str)
  }

  /**
   * Convert string to kebab-case
   */
  const toKebabCase = (str: string): string => {
    return StringUtils.toKebabCase(str)
  }

  /**
   * Convert string to snake_case
   */
  const toSnakeCase = (str: string): string => {
    return StringUtils.toSnakeCase(str)
  }

  /**
   * Convert string to title case
   */
  const toTitleCase = (str: string): string => {
    return StringUtils.toTitleCase(str)
  }

  /**
   * Truncate string to specified length
   */
  const truncate = (str: string, length: number, suffix: string = '...'): string => {
    return StringUtils.truncate(str, length, suffix)
  }

  /**
   * Truncate string to specified length at word boundary
   */
  const truncateWords = (str: string, length: number, suffix: string = '...'): string => {
    return StringUtils.truncateWords(str, length, suffix)
  }

  /**
   * Remove HTML tags from string
   */
  const stripHtml = (html: string): string => {
    return StringUtils.stripHtml(html)
  }

  /**
   * Escape HTML special characters
   */
  const escapeHtml = (str: string): string => {
    return StringUtils.escapeHtml(str)
  }

  /**
   * Unescape HTML special characters
   */
  const unescapeHtml = (str: string): string => {
    return StringUtils.unescapeHtml(str)
  }

  /**
   * Generate random string
   */
  const random = (length: number = 10, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string => {
    return StringUtils.random(length, charset)
  }

  /**
   * Generate UUID v4
   */
  const uuid = (): string => {
    return StringUtils.uuid()
  }

  /**
   * Generate slug from string
   */
  const slug = (str: string): string => {
    return StringUtils.slug(str)
  }

  /**
   * Check if string is empty or whitespace
   */
  const isEmpty = (str: string): boolean => {
    return StringUtils.isEmpty(str)
  }

  /**
   * Check if string is not empty
   */
  const isNotEmpty = (str: string): boolean => {
    return StringUtils.isNotEmpty(str)
  }

  /**
   * Check if string is email
   */
  const isEmail = (str: string): boolean => {
    return StringUtils.isEmail(str)
  }

  /**
   * Check if string is URL
   */
  const isUrl = (str: string): boolean => {
    return StringUtils.isUrl(str)
  }

  /**
   * Check if string is phone number
   */
  const isPhoneNumber = (str: string): boolean => {
    return StringUtils.isPhoneNumber(str)
  }

  /**
   * Check if string is numeric
   */
  const isNumeric = (str: string): boolean => {
    return StringUtils.isNumeric(str)
  }

  /**
   * Check if string is integer
   */
  const isInteger = (str: string): boolean => {
    return StringUtils.isInteger(str)
  }

  /**
   * Check if string is valid JSON
   */
  const isJson = (str: string): boolean => {
    return StringUtils.isJson(str)
  }

  /**
   * Format phone number
   */
  const formatPhoneNumber = (phone: string, format: string = '(XXX) XXX-XXXX'): string => {
    return StringUtils.formatPhoneNumber(phone, format)
  }

  /**
   * Format credit card number
   */
  const formatCreditCard = (cardNumber: string, separator: string = ' '): string => {
    return StringUtils.formatCreditCard(cardNumber, separator)
  }

  /**
   * Mask sensitive information
   */
  const mask = (str: string, visibleChars: number = 4, maskChar: string = '*'): string => {
    return StringUtils.mask(str, visibleChars, maskChar)
  }

  /**
   * Mask email
   */
  const maskEmail = (email: string): string => {
    return StringUtils.maskEmail(email)
  }

  /**
   * Mask phone number
   */
  const maskPhone = (phone: string): string => {
    return StringUtils.maskPhone(phone)
  }

  /**
   * Remove accents from string
   */
  const removeAccents = (str: string): string => {
    return StringUtils.removeAccents(str)
  }

  /**
   * Count words in string
   */
  const countWords = (str: string): number => {
    return StringUtils.countWords(str)
  }

  /**
   * Count characters in string
   */
  const countCharacters = (str: string): number => {
    return StringUtils.countCharacters(str)
  }

  /**
   * Count lines in string
   */
  const countLines = (str: string): number => {
    return StringUtils.countLines(str)
  }

  /**
   * Reverse string
   */
  const reverse = (str: string): string => {
    return StringUtils.reverse(str)
  }

  /**
   * Check if string is palindrome
   */
  const isPalindrome = (str: string): boolean => {
    return StringUtils.isPalindrome(str)
  }

  /**
   * Get initials from name
   */
  const getInitials = (name: string, maxInitials: number = 2): string => {
    return StringUtils.getInitials(name, maxInitials)
  }

  /**
   * Convert string to array of characters
   */
  const toArray = (str: string): string[] => {
    return StringUtils.toArray(str)
  }

  /**
   * Join array of strings
   */
  const join = (array: string[], separator: string = ''): string => {
    return StringUtils.join(array, separator)
  }

  /**
   * Split string by delimiter
   */
  const split = (str: string, delimiter: string | RegExp): string[] => {
    return StringUtils.split(str, delimiter)
  }

  /**
   * Replace all occurrences
   */
  const replaceAll = (str: string, search: string, replacement: string): string => {
    return StringUtils.replaceAll(str, search, replacement)
  }

  /**
   * Remove duplicate characters
   */
  const removeDuplicates = (str: string): string => {
    return StringUtils.removeDuplicates(str)
  }

  /**
   * Sort characters in string
   */
  const sort = (str: string): string => {
    return StringUtils.sort(str)
  }

  /**
   * Check if string contains only letters
   */
  const isAlpha = (str: string): boolean => {
    return StringUtils.isAlpha(str)
  }

  /**
   * Check if string contains only digits
   */
  const isDigit = (str: string): boolean => {
    return StringUtils.isDigit(str)
  }

  /**
   * Check if string contains only alphanumeric characters
   */
  const isAlphanumeric = (str: string): boolean => {
    return StringUtils.isAlphanumeric(str)
  }

  /**
   * Check if string is valid password
   */
  const isValidPassword = (password: string, minLength: number = 8): boolean => {
    return StringUtils.isValidPassword(password, minLength)
  }

  /**
   * Generate password
   */
  const generatePassword = (length: number = 12): string => {
    return StringUtils.generatePassword(length)
  }

  /**
   * Check if string starts with substring
   */
  const startsWith = (str: string, prefix: string): boolean => {
    return StringUtils.startsWith(str, prefix)
  }

  /**
   * Check if string ends with substring
   */
  const endsWith = (str: string, suffix: string): boolean => {
    return StringUtils.endsWith(str, suffix)
  }

  /**
   * Check if string contains substring
   */
  const contains = (str: string, substring: string): boolean => {
    return StringUtils.contains(str, substring)
  }

  /**
   * Find all occurrences of substring
   */
  const findAll = (str: string, substring: string): number[] => {
    return StringUtils.findAll(str, substring)
  }

  /**
   * Get substring between two strings
   */
  const between = (str: string, start: string, end: string): string => {
    return StringUtils.between(str, start, end)
  }

  /**
   * Pad string to specified length
   */
  const pad = (str: string, length: number, padString: string = ' ', direction: 'left' | 'right' | 'both' = 'right'): string => {
    return StringUtils.pad(str, length, padString, direction)
  }

  /**
   * Remove leading/trailing whitespace
   */
  const trim = (str: string): string => {
    return StringUtils.trim(str)
  }

  /**
   * Remove leading whitespace
   */
  const trimStart = (str: string): string => {
    return StringUtils.trimStart(str)
  }

  /**
   * Remove trailing whitespace
   */
  const trimEnd = (str: string): string => {
    return StringUtils.trimEnd(str)
  }

  return {
    capitalize,
    capitalizeWords,
    toCamelCase,
    toPascalCase,
    toKebabCase,
    toSnakeCase,
    toTitleCase,
    truncate,
    truncateWords,
    stripHtml,
    escapeHtml,
    unescapeHtml,
    random,
    uuid,
    slug,
    isEmpty,
    isNotEmpty,
    isEmail,
    isUrl,
    isPhoneNumber,
    isNumeric,
    isInteger,
    isJson,
    formatPhoneNumber,
    formatCreditCard,
    mask,
    maskEmail,
    maskPhone,
    removeAccents,
    countWords,
    countCharacters,
    countLines,
    reverse,
    isPalindrome,
    getInitials,
    toArray,
    join,
    split,
    replaceAll,
    removeDuplicates,
    sort,
    isAlpha,
    isDigit,
    isAlphanumeric,
    isValidPassword,
    generatePassword,
    startsWith,
    endsWith,
    contains,
    findAll,
    between,
    pad,
    trim,
    trimStart,
    trimEnd
  }
}
