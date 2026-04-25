import { NewMemberResponse, MinecraftStatResponse, DiscountedGameResponse, TagResponse } from '../../../models';

export class GeneralContentMapper {
  static mapNewMember(item: any): NewMemberResponse {
    return {
      id: Number(item.oyuncuid || item.id || item.ID || item['#']) || 0,
      displayName: item.oyuncuadi || item.adsoyad || item.oyuncuadsoyad || '',
      avatar: item.oyuncuavatar || item.avatar || '',
      level: Number(item.oyuncuseviye || item.seviye) || 0,
      levelColor: item.oyuncuseviyerenk || item.seviyerenk || '',
      xp: Number(item.oyuncuxp || item.xp) || 0,
      profileLink: item.oyunculink || item.link || '',
      isMe: item.oyuncuben === 1 || item.ben === 1
    };
  }

  static mapMinecraftStat(item: any): MinecraftStatResponse {
    return {
      rank: Number(item['#']) || 0,
      username: item.kullaniciad || '',
      clan: item.klan || null,
      clanColor: item.klanrenk || null,
      kills: Number(item.lessayisi) || 0
    };
  }

  static mapDiscountedGame(item: any): DiscountedGameResponse {
    // Current API returns empty array, but we prepare for this structure
    return {
      id: Number(item['#']) || 0,
      title: item.baslik || '',
      image: item.gorsel || '',
      originalPrice: item.eskifiyat || '0',
      discountedPrice: item.yenifiyat || '0',
      discountPercentage: item.indirimyuzde || '0',
      store: item.magaza || '',
      link: item.link || ''
    };
  }

  static mapNewMemberList(items: any[]): NewMemberResponse[] {
    if (!Array.isArray(items)) return [];
    return items.map(item => this.mapNewMember(item));
  }

  static mapMinecraftStatList(items: any[]): MinecraftStatResponse[] {
    if (!Array.isArray(items)) return [];
    return items.map(item => this.mapMinecraftStat(item));
  }

  static mapDiscountedGameList(items: any[]): DiscountedGameResponse[] {
    if (!Array.isArray(items)) return [];
    return items.map(item => this.mapDiscountedGame(item));
  }
}
