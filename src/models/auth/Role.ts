/**
 * Represents a User Role in the aramizdakioyuncu.com platform.
 */
export class Role {
  id: string = '';
  name: string = '';
  color: string = '';
  permissions: string[] = [];

  constructor(data: Partial<Role>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Role object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Role {
    return new Role({
      id: json.id || '',
      name: json.name || json.title || '',
      color: json.color || '#808080',
      permissions: json.permissions || [],
    });
  }
}
