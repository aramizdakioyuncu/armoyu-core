import { EventParticipantsDTO } from '../../models';
import { BaseMapper } from '../mappers/BaseMapper';

export class EventMapperV2 extends BaseMapper {
  static mapParticipants(raw: any): EventParticipantsDTO {
    const list = Array.isArray(raw) ? raw : [];
    const individuals = list.map((p: any) => ({
      id: this.toId(p.kim),
      name: p.display_name || '',
      username: p.user_nicename || '',
      avatar: this.toImageUrl(p.avatar) || ''
    }));
    return { groups: [], individuals };
  }

  static mapTeams(raw: any[]): any[] {
    return (raw || []).map((t: any) => ({
      id: this.toNumber(t.katilimcigrup),
      participationId: this.toNumber(t.katilim_id),
      name: t.grup_adi || '',
      logo: this.toImageUrl(t.grup_logo) || '',
      banner: this.toImageUrl(t.grup_arkaplan) || '',
      url: t.grup_url || '',
      shortName: t.grup_kisaltma || '',
      answer: t.yanit,
      approved: this.toBool(t.onay),
      players: Array.isArray(t.katilimcilar) ? t.katilimcilar.map((p: any) => ({
        id: this.toNumber(p.etkkdoyuncuid),
        participantDetailId: this.toNumber(p.etkkdid),
        position: p.etkkdmevkisi || '',
        positionRank: this.toNumber(p.etkkdmevkisiralama)
      })) : []
    }));
  }
}
