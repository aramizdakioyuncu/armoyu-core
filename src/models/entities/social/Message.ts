import { MessageDTO } from '../../dto/social/ChatDTO';

export class Message implements MessageDTO {
  side: 'ben' | 'sen';
  authorName: string;
  authorAvatar: string;
  authorColor?: string;
  content: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  status: number;

  constructor(data: MessageDTO) {
    this.side = data.side;
    this.authorName = data.authorName;
    this.authorAvatar = data.authorAvatar;
    this.authorColor = data.authorColor;
    this.content = data.content;
    this.date = data.date;
    this.dateLabel = data.dateLabel;
    this.timeLabel = data.timeLabel;
    this.status = data.status;
  }

  /**
   * Returns true if the message was sent by the current user.
   */
  get isMine(): boolean {
    return this.side === 'ben';
  }

  /**
   * Returns true if the message has been read by the recipient.
   */
  get isRead(): boolean {
    return this.status === 1; // Assuming 1 means read based on common patterns
  }

  /**
   * Formatted time for display.
   */
  get displayTime(): string {
    return this.timeLabel || '';
  }

  /**
   * Factory method to create a Message from a DTO.
   */
  static fromJSON(data: MessageDTO): Message {
    return new Message(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): MessageDTO {
    return {
      side: this.side,
      authorName: this.authorName,
      authorAvatar: this.authorAvatar,
      authorColor: this.authorColor,
      content: this.content,
      date: this.date,
      dateLabel: this.dateLabel,
      timeLabel: this.timeLabel,
      status: this.status
    };
  }
}
