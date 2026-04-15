/**
 * ValidationUtils — static helpers for validating common field values.
 *
 * All methods return `true` when valid, or a descriptive error string when invalid.
 * Designed for direct use with React Hook Form's `validate` option.
 *
 * Usage:
 *   ValidationUtils.required('hello')          // true
 *   ValidationUtils.required('')               // 'This field is required'
 *   ValidationUtils.email('a@b.com')           // true
 *   ValidationUtils.minLength('hi', 5)         // 'Minimum 5 characters required'
 *   ValidationUtils.isValidUrl('https://…')    // true
 */
export class ValidationUtils {
  // ─── Common ───────────────────────────────────────────────────────────────

  /** Fails when the value is empty, null, undefined, or whitespace-only. */
  static required(value: unknown, message = 'This field is required'): true | string {
    if (value === null || value === undefined) return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    if (Array.isArray(value) && value.length === 0) return message;
    return true;
  }

  /** Validates email format (RFC-permissive). */
  static email(value: string, message = 'Enter a valid email address'): true | string {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.trim()) || message;
  }

  /** Validates a phone number (digits, spaces, dashes, +, parens). */
  static phone(value: string, message = 'Enter a valid phone number'): true | string {
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/;
    return re.test(value.replace(/\s/g, '')) || message;
  }

  // ─── Length ───────────────────────────────────────────────────────────────

  /** Fails when string length is below min. */
  static minLength(value: string, min: number, message?: string): true | string {
    if (value.length >= min) return true;
    return message ?? `Minimum ${min} character${min === 1 ? '' : 's'} required`;
  }

  /** Fails when string length exceeds max. */
  static maxLength(value: string, max: number, message?: string): true | string {
    if (value.length <= max) return true;
    return message ?? `Maximum ${max} character${max === 1 ? '' : 's'} allowed`;
  }

  // ─── Numbers ─────────────────────────────────────────────────────────────

  /** Fails when value is not a finite number. */
  static numeric(value: unknown, message = 'Must be a number'): true | string {
    return Number.isFinite(Number(value)) || message;
  }

  /** Fails when numeric value is below min. */
  static min(value: number, min: number, message?: string): true | string {
    if (value >= min) return true;
    return message ?? `Minimum value is ${min}`;
  }

  /** Fails when numeric value exceeds max. */
  static max(value: number, max: number, message?: string): true | string {
    if (value <= max) return true;
    return message ?? `Maximum value is ${max}`;
  }

  // ─── Pattern ─────────────────────────────────────────────────────────────

  /** Fails when value does not match the provided regex. */
  static pattern(value: string, regex: RegExp, message = 'Invalid format'): true | string {
    return regex.test(value) || message;
  }

  /** Validates URL (http / https only). */
  static url(value: string, message = 'Enter a valid URL'): true | string {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) || message;
    } catch {
      return message;
    }
  }

  // ─── Password ─────────────────────────────────────────────────────────────

  /**
   * Validates password strength.
   * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.
   */
  static strongPassword(value: string, message?: string): true | string {
    const issues: string[] = [];
    if (value.length < 8) issues.push('at least 8 characters');
    if (!/[A-Z]/.test(value)) issues.push('one uppercase letter');
    if (!/[a-z]/.test(value)) issues.push('one lowercase letter');
    if (!/[0-9]/.test(value)) issues.push('one number');
    if (!/[^A-Za-z0-9]/.test(value)) issues.push('one special character');
    if (issues.length === 0) return true;
    return message ?? `Password must contain ${issues.join(', ')}`;
  }

  /** Checks that two values match (e.g. confirm password). */
  static matches(value: string, other: string, message = 'Values do not match'): true | string {
    return value === other || message;
  }

  // ─── Date ─────────────────────────────────────────────────────────────────

  /** Validates an ISO date string or Date object. */
  static validDate(value: unknown, message = 'Enter a valid date'): true | string {
    const d = new Date(value as string);
    return !isNaN(d.getTime()) || message;
  }

  /** Fails when date is in the past. */
  static futureDate(value: string | Date, message = 'Date must be in the future'): true | string {
    const d = new Date(value);
    return d.getTime() > Date.now() || message;
  }

  // ─── Misc ─────────────────────────────────────────────────────────────────

  /** Validates a UUID v4. */
  static uuid(value: string, message = 'Invalid identifier'): true | string {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return re.test(value) || message;
  }

  /** Validates that a value is one of the provided options. */
  static oneOf<T>(value: T, options: T[], message?: string): true | string {
    if (options.includes(value)) return true;
    return message ?? `Must be one of: ${options.join(', ')}`;
  }
}
