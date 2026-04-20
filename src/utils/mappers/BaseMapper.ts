/**
 * Base class for all response mappers.
 * Provides shared logic and ensures consistency.
 */
export abstract class BaseMapper {
  /**
   * global strict mode toggle.
   * true (Default) -> Enforce Strict V1 mapping (returns null in shouldReturnRaw)
   * false          -> Disable mapping, return RAW data (fallback)
   */
  private static strictMode: boolean = true;

  /**
   * Set the library-wide strict mode.
   */
  static setStrictMode(enabled: boolean): void {
    this.strictMode = enabled;
  }

  /**
   * Get the library-wide strict mode status.
   */
  static isStrict(): boolean {
    return this.strictMode;
  }

  /**
   * Helper to normalize nullable numbers.
   */
  protected static toNumber(value: any, fallback: number = 0): number {
    return value !== undefined && value !== null ? Number(value) : fallback;
  }

  /**
   * Helper to normalize boolean flags from API (1/0 or actual bool).
   */
  protected static toBool(value: any): boolean {
    return Number(value) === 1 || !!value;
  }

  /**
   * Helper to strictly normalize values to strings.
   */
  protected static toString(value: any): string {
    if (value === undefined || value === null) return '';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  /**
   * Helper to safely extract an image URL from strings or ARMOYU media objects.
   */
  protected static toImageUrl(value: any): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      const url = value.media_URL || value.media_bigURL || value.media_minURL || value.url;
      if (url && typeof url === 'string') return url;
      const nestedUrl = value.player_avatar || value.chatImage?.media_URL;
      if (nestedUrl && typeof nestedUrl === 'string') return nestedUrl;
    }
    return undefined;
  }

  /**
   * Logic for bypassing mapping:
   * Returns 'raw' if strictMode is false.
   * Returns 'null' if strictMode is true (forces the mapper to continue with manual mapping).
   */
  protected static shouldReturnRaw<T>(raw: any): T | null {
    if (!raw) return null;
    if (!this.strictMode) return raw as T;
    return null;
  }
}
