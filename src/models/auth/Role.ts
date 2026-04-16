import { BaseModel } from '../BaseModel';

/**
 * Represents a User Role in the aramizdakioyuncu.com platform.
 */
export class Role extends BaseModel {
  id: string = '';
  name: string = '';
  color: string = '';
  permissions: string[] = [];

  constructor(data: Partial<Role>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Role object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Role {
    if (BaseModel.usePreviousApi) {
      return Role.legacyFromJSON(json);
    }
    return Role.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Role {
    return new Role({
      id: json.id || '',
      name: json.name || json.title || '',
      color: json.color || '#808080',
      permissions: json.permissions || [],
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Role {
    return new Role({});
  }
}
