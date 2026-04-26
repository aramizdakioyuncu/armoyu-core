import { NotificationDTO, NotificationSenderDTO } from '../../dto/social/NotificationDTO';

export class Notification implements NotificationDTO {
  id: number;
  type: string;
  sender: NotificationSenderDTO;
  content: string;
  date: string;
  isRead: boolean;

  constructor(data: NotificationDTO) {
    this.id = data.id;
    this.type = data.type;
    this.sender = data.sender;
    this.content = data.content;
    this.date = data.date;
    this.isRead = data.isRead;
  }

  /**
   * Returns a clean URL for the notification action based on its type.
   */
  get actionUrl(): string {
    switch (this.type) {
      case 'paylasim_begeni':
      case 'paylasim_yorum':
        return `/sosyal/post/0`; // Ideally we'd need a target ID in the DTO for this
      case 'arkadaslik_istegi':
        return `/profil/arkadaslar`;
      default:
        return `/bildirimler`;
    }
  }

  /**
   * Returns a friendly label for the notification type.
   */
  get typeLabel(): string {
    switch (this.type) {
      case 'paylasim_begeni': return 'Beğeni';
      case 'paylasim_yorum': return 'Yorum';
      case 'arkadaslik_istegi': return 'Arkadaşlık İsteği';
      default: return 'Sistem Bildirimi';
    }
  }

  /**
   * Factory method to create a Notification from a DTO.
   */
  static fromJSON(data: NotificationDTO): Notification {
    return new Notification(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): NotificationDTO {
    return {
      id: this.id,
      type: this.type,
      sender: this.sender,
      content: this.content,
      date: this.date,
      isRead: this.isRead
    };
  }
}
