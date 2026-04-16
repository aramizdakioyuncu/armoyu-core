/**
 * Base class for all models in the ARMOYU ecosystem.
 * Provides a global mechanism to switch between legacy and newer API structures.
 */
export abstract class BaseModel {
  /**
   * Global toggle to determine which API mapping logic to use.
   * If true: Uses legacyFromJSON (Legacy ARMOYU v0/v1 style).
   * If false: Uses v2FromJSON (Standardized ARMOYU v2 style).
   */
  static usePreviousApi: boolean = true;
}
