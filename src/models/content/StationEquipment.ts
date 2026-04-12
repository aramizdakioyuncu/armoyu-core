/**
 * Represents equipment available at a station.
 */
export class StationEquipment {
  id: number = 0;
  name: string = '';
  type: string = '';
  image: string = '';
  price: number = 0;

  constructor(data: Partial<StationEquipment>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a StationEquipment object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): StationEquipment {
    return new StationEquipment({
      id: Number(json.equipment_ID || 0),
      name: json.equipment_name || '',
      type: json.equipment_type || '',
      image: json.equipment_image || '',
      price: parseFloat(json.equipment_price || '0')
    });
  }
}
