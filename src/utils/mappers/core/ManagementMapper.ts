import { ManagementUser } from '../../../models/entities/core/ManagementUser';
import { ManagementMeeting } from '../../../models/entities/core/ManagementMeeting';
import { BaseMapper } from '../BaseMapper';

export class ManagementMapper extends BaseMapper {
  static mapUserV1(raw: any): ManagementUser {
    return new ManagementUser({
      userNumber: raw.kullanici_no || '',
      username: raw.user_login || '',
      displayName: raw.display_name || '',
      avatar: this.toImageUrl(raw.avatar) || '',
      role: raw.yetki || '',
      registeredBy: raw.kayit_eden || '',
      age: this.toNumber(raw.yas),
      lastLogin: raw.son_giris || '',
      remainingRights: this.toNumber(raw.kalan_hak),
      isProblem: raw.problemli === true
    });
  }

  static mapUserV2(raw: any): ManagementUser {
    return new ManagementUser({
      userNumber: raw.kullanici_no || '',
      username: raw.user_login || '',
      displayName: raw.display_name || '',
      avatar: this.toImageUrl(raw.avatar) || '',
      role: String(raw.yetki ?? ''),
      registeredBy: raw.kayit_eden || '',
      age: this.toNumber(raw.yas),
      lastLogin: raw.son_giris || '',
      remainingRights: this.toNumber(raw.kalan_hak?.hak ?? raw.kalan_hak),
      isProblem: raw.problemli === true
    });
  }

  static mapUserListV1(rawList: any[]): ManagementUser[] {
    return (rawList || []).map(item => this.mapUserV1(item));
  }

  static mapUserListV2(rawList: any[]): ManagementUser[] {
    return (rawList || []).map(item => this.mapUserV2(item));
  }

  static mapMeetingV1(raw: any): ManagementMeeting {
    return new ManagementMeeting({
      id: this.toNumber(raw.etkinlik_id),
      name: raw.etkinlik_adi || '',
      creatorName: raw.olusturan || '',
      creatorAvatar: this.toImageUrl(raw.olusturan_avatar) || '',
      date: raw.zaman || '',
      participantCount: this.toNumber(raw.katilimci_sayisi),
      participantLimit: String(raw.katilim_limit ?? ''),
      status: raw.durum || ''
    });
  }

  static mapMeetingV2(raw: any): ManagementMeeting {
    return new ManagementMeeting({
      id: this.toNumber(raw.etkinlik_id),
      name: raw.etkinlik_adi || '',
      creatorName: raw.olusturan || '',
      creatorAvatar: this.toImageUrl(raw.olusturan_avatar) || '',
      date: raw.zaman || '',
      participantCount: this.toNumber(raw.katilimci_sayisi),
      participantLimit: String(raw.katilim_limit ?? ''),
      status: raw.durum || ''
    });
  }

  static mapMeetingListV1(rawList: any[]): ManagementMeeting[] {
    return (rawList || []).map(item => this.mapMeetingV1(item));
  }

  static mapMeetingListV2(rawList: any[]): ManagementMeeting[] {
    return (rawList || []).map(item => this.mapMeetingV2(item));
  }
}
