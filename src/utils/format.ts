/**
 * FormatUtils — static helpers for formatting values for display.
 *
 * Usage:
 *   FormatUtils.date(new Date())           // '15 Apr 2026'
 *   FormatUtils.currency(1999.5, 'USD')    // '$1,999.50'
 *   FormatUtils.initials('John Doe')       // 'JD'
 *   FormatUtils.truncate('Long text', 20)  // 'Long text...'
 *   FormatUtils.fileSize(2048)             // '2 KB'
 */
export class FormatUtils {
  // ─── Date & Time ─────────────────────────────────────────────────────────

  /**
   * Formats a date to a readable short string.
   * @example FormatUtils.date(new Date()) → '15 Apr 2026'
   */
  static date(date: Date | string | number, locale = 'en-US'): string {
    const d = new Date(date);
    return d.toLocaleDateString(locale, {
 day: 'numeric',
month: 'short',
year: 'numeric' 
});
  }

  /**
   * Formats a date with time.
   * @example FormatUtils.dateTime(new Date()) → '15 Apr 2026, 09:30'
   */
  static dateTime(date: Date | string | number, locale = 'en-US'): string {
    const d = new Date(date);
    return d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formats a time value.
   * @example FormatUtils.time(new Date()) → '09:30 AM'
   */
  static time(date: Date | string | number, locale = 'en-US'): string {
    const d = new Date(date);
    return d.toLocaleTimeString(locale, {
 hour: '2-digit',
minute: '2-digit' 
});
  }

  /**
   * Returns a relative time label (e.g. "3 min ago", "just now", "2 days ago").
   */
  static relativeTime(date: Date | string | number): string {
    const d = new Date(date);
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'yesterday';
    if (diffDay < 30) return `${diffDay} days ago`;
    return FormatUtils.date(d);
  }

  // ─── Numbers ─────────────────────────────────────────────────────────────

  /**
   * Formats a number with locale-aware thousand separators.
   * @example FormatUtils.number(1234567) → '1,234,567'
   */
  static number(value: number, locale = 'en-US'): string {
    return value.toLocaleString(locale);
  }

  /**
   * Formats a number as currency.
   * @example FormatUtils.currency(1999.5) → '$1,999.50'
   */
  static currency(value: number, currency = 'USD', locale = 'en-US'): string {
    return value.toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Formats a decimal as a percentage string.
   * @example FormatUtils.percent(0.756) → '75.6%'
   */
  static percent(value: number, decimalPlaces = 1): string {
    return `${(value * 100).toFixed(decimalPlaces)}%`;
  }

  /**
   * Compacts large numbers with K / M / B suffix.
   * @example FormatUtils.compact(1500000) → '1.5M'
   */
  static compact(value: number): string {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return String(value);
  }

  // ─── Strings ─────────────────────────────────────────────────────────────

  /**
   * Truncates text to maxLength and appends an ellipsis.
   * @example FormatUtils.truncate('Hello world', 8) → 'Hello wo…'
   */
  static truncate(text: string, maxLength: number, ellipsis = '…'): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - ellipsis.length) + ellipsis;
  }

  /**
   * Derives up to two uppercase initials from a full name.
   * @example FormatUtils.initials('Jane Doe') → 'JD'
   */
  static initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || parts[0] === '') return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Capitalises the first letter of a string.
   * @example FormatUtils.capitalize('hello world') → 'Hello world'
   */
  static capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Converts camelCase or snake_case to a human-readable label.
   * @example FormatUtils.humanize('firstName') → 'First Name'
   * @example FormatUtils.humanize('some_key')  → 'Some Key'
   */
  static humanize(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // ─── File & Data ─────────────────────────────────────────────────────────

  /**
   * Converts bytes to a human-readable file size.
   * @example FormatUtils.fileSize(2048) → '2 KB'
   */
  static fileSize(bytes: number): string {
    if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`;
    if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`;
    return `${bytes} B`;
  }

  /**
   * Formats a duration in seconds to MM:SS or HH:MM:SS.
   * @example FormatUtils.duration(125) → '2:05'
   * @example FormatUtils.duration(3700) → '1:01:40'
   */
  static duration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    if (h > 0) return `${h}:${mm}:${ss}`;
    return `${m}:${ss}`;
  }
}
