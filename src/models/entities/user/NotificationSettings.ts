import { NotificationSettingsDTO } from '../../dto/user/NotificationSettingsDTO';

export class NotificationSettings {
  postLike: boolean;
  postComment: boolean;
  commentLike: boolean;
  birthday: boolean;
  event: boolean;
  commentReply: boolean;
  messages: boolean;
  calls: boolean;
  mentions: boolean;

  constructor(data: {
    postLike: boolean;
    postComment: boolean;
    commentLike: boolean;
    birthday: boolean;
    event: boolean;
    commentReply: boolean;
    messages: boolean;
    calls: boolean;
    mentions: boolean;
  }) {
    this.postLike = data.postLike;
    this.postComment = data.postComment;
    this.commentLike = data.commentLike;
    this.birthday = data.birthday;
    this.event = data.event;
    this.commentReply = data.commentReply;
    this.messages = data.messages;
    this.calls = data.calls;
    this.mentions = data.mentions;
  }

  static fromDTO(dto: NotificationSettingsDTO): NotificationSettings {
    return new NotificationSettings({
      postLike: dto.paylasimbegeni === 1,
      postComment: dto.paylasimyorum === 1,
      commentLike: dto.yorumbegeni === 1,
      birthday: dto.dogumgunu === 1,
      event: dto.etkinlik === 1,
      commentReply: dto.yorumyanit === 1,
      messages: dto.mesajlar === 1,
      calls: dto.aramalar === 1,
      mentions: dto.bahsetmeler === 1
    });
  }

  toDTO(): NotificationSettingsDTO {
    return {
      paylasimbegeni: this.postLike ? 1 : 0,
      paylasimyorum: this.postComment ? 1 : 0,
      yorumbegeni: this.commentLike ? 1 : 0,
      dogumgunu: this.birthday ? 1 : 0,
      etkinlik: this.event ? 1 : 0,
      yorumyanit: this.commentReply ? 1 : 0,
      mesajlar: this.messages ? 1 : 0,
      aramalar: this.calls ? 1 : 0,
      bahsetmeler: this.mentions ? 1 : 0
    };
  }
}
