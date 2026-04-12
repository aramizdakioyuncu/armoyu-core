/**
 * Represents an option within a poll.
 */
export class PollOption {
  id: number = 0;
  answer: string = '';
  votingPercentage: number = 0;

  constructor(data: Partial<PollOption>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a PollOption object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): PollOption {
    return new PollOption({
      id: Number(json.option_ID || 0),
      answer: json.option_answer || '',
      votingPercentage: parseFloat(json.option_votingPercentage || '0')
    });
  }
}
