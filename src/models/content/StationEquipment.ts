import { BaseModel } from '../BaseModel';

/**
 * Represents equipment available at a station.
 */
export class StationEquipment extends BaseModel {
  id: number = 0;
  name: string = '';
  type: string = '';
  image: string = '';
  price: number = 0;

  constructor(data: Partial<StationEquipment>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a StationEquipment object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): StationEquipment {
    if (BaseModel.usePreviousApi) {
      return StationEquipment.legacyFromJSON(json);
    }
    return StationEquipment.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): StationEquipment {
    return new StationEquipment({
      id: Number(json.equipment_ID || 0),
      name: json.equipment_name || '',
      type: json.equipment_type || '',
      image: json.equipment_image || '',
      price: parseFloat(json.equipment_price || '0')
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): StationEquipment {
    return new StationEquipment({});
  }
}
