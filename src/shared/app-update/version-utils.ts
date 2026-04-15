/**
 * Lightweight semantic version compare (major.minor.patch only).
 * No external semver dependency: validates numeric segments and compares tuple-wise.
 */

const SEGMENT_PATTERN = /^\d+$/;

export type ParsedSemver = readonly [number, number, number];

/**
 * Parses strings like "1", "1.2", "1.2.3" into [major, minor, patch], padding missing parts with 0.
 * Returns null if the string is not a safe dotted-numeric form (avoids throwing).
 */
export class VersionUtils {
  static parse(version: string | null | undefined): ParsedSemver | null {
    if (version == null || typeof version !== 'string') return null;
    const trimmed = version.trim();
    if (!trimmed) return null;

    const parts = trimmed.split('.');
    if (parts.length > 3) return null;
    if (parts.some((p) => !SEGMENT_PATTERN.test(p))) return null;

    const major = Number(parts[0]);
    const minor = parts.length >= 2 ? Number(parts[1]) : 0;
    const patch = parts.length >= 3 ? Number(parts[2]) : 0;

    if (![
major,
minor,
patch
].every((n) => Number.isFinite(n) && n >= 0)) {
      return null;
    }

    return [
major,
minor,
patch
] as const;
  }

/**
 * Compares two semver strings. Returns:
 * - negative if a < b
 * - 0 if a === b
 * - positive if a > b
 * Returns null if either value cannot be parsed (caller should treat as "incomparable").
 */
  static compare(a: string, b: string): number | null {
    const pa = VersionUtils.parse(a);
    const pb = VersionUtils.parse(b);
    if (!pa || !pb) return null;

    for (let i = 0; i < 3; i += 1) {
      if (pa[i] !== pb[i]) return pa[i] - pb[i];
    }
    return 0;
  }

/** True when both strings parse and are equal. */
  static equal(a: string, b: string): boolean {
    return VersionUtils.compare(a, b) === 0;
  }
}
