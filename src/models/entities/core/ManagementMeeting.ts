import { ManagementMeetingDTO } from '../../dto/core/ManagementDTO';

export class ManagementMeeting implements ManagementMeetingDTO {
  id: number;
  name: string;
  creatorName: string;
  creatorAvatar: string;
  date: string;
  participantCount: number;
  participantLimit: string;
  status: string;

  constructor(data: ManagementMeetingDTO) {
    this.id = data.id;
    this.name = data.name;
    this.creatorName = data.creatorName;
    this.creatorAvatar = data.creatorAvatar;
    this.date = data.date;
    this.participantCount = data.participantCount;
    this.participantLimit = data.participantLimit;
    this.status = data.status;
  }

  get isClosed(): boolean {
    return this.status === 'Kapalı';
  }

  get isUnlimited(): boolean {
    return this.participantLimit === '∞';
  }

  static fromJSON(data: ManagementMeetingDTO): ManagementMeeting {
    return new ManagementMeeting(data);
  }

  toJSON(): ManagementMeetingDTO {
    return {
      id: this.id,
      name: this.name,
      creatorName: this.creatorName,
      creatorAvatar: this.creatorAvatar,
      date: this.date,
      participantCount: this.participantCount,
      participantLimit: this.participantLimit,
      status: this.status
    };
  }
}
