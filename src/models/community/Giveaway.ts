/**
 * Represents a Giveaway (Çekiliş) in the aramizdakioyuncu.com platform.
 */
export class Giveaway {
  id: string = '';
  title: string = '';
  prize: string = '';
  status: 'active' | 'ended' = 'active';
  participants: number = 0;
  timeLeft: string = '';
  image: string = '';

  constructor(data: Partial<Giveaway>) {
    Object.assign(this, data);
  }

  /**
   * Returns true if the giveaway is currently active.
   */
  isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * Instantiates a Giveaway object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Giveaway {
    return new Giveaway({
      id: json.id || '',
      title: json.title || '',
      prize: json.prize || '',
      status: json.status || 'active',
      participants: json.participants || 0,
      timeLeft: json.timeLeft || json.time_left || '',
      image: json.image || '',
    });
  }
}
