import { Group } from '../../models/community/Group';
import { BaseMapper } from './BaseMapper';

/**
 * Mapper for Group related data structures.
 */
export class GroupMapper extends BaseMapper {
  /**
   * Maps raw group data to the standardized Group interface.
   * Maintains backward compatibility.
   */
  static mapGroup(raw: any, usePreviousVersion: boolean = false): Group {
    const legacy = this.shouldReturnRaw<Group>(raw, usePreviousVersion);
    if (legacy) return legacy;
    if (!raw) return {} as Group;

    return {
      ...this.mapGroupIdentity(raw),
      ...this.mapGroupVisuals(raw),
      ...this.mapGroupStats(raw),
      isPrivate: raw.isPrivate,
      owner: raw.owner,
      moderators: raw.moderators,
      members: raw.members
    };
  }

  /**
   * Modern v2 mapping for Group.
   */
  static mapGroupV2(raw: any): Group {
    return this.mapGroup(raw, false);
  }

  /**
   * Atomic: Maps group identity.
   */
  static mapGroupIdentity(raw: any) {
    return {
      id: this.toNumber(raw.grupID || raw.id || raw.group_ID || raw.groupID),
      name: raw.grup_ad || raw.name || raw.group_name || raw.baslik,
      shortName: raw.grup_etiket || raw.shortName || raw.group_shortName || raw.grupetiket,
      slug: raw.grupURL || raw.slug || raw.group_URL,
      description: raw.grup_aciklama || raw.description || raw.aciklama,
      category: raw.grup_kategori || raw.category,
      tag: raw.grupetiket || raw.tag,
      url: raw.group_URL || raw.url
    };
  }

  /**
   * Atomic: Maps group visuals.
   */
  static mapGroupVisuals(raw: any) {
    return {
      logo: raw.grup_logo || raw.logo || raw.group_logo,
      banner: raw.grup_banner || raw.banner || raw.group_banner,
      wallpaper: raw.grup_arkaplan || raw.wallpaper || raw.group_wallpaper
    };
  }

  /**
   * Atomic: Maps group statistics.
   */
  static mapGroupStats(raw: any) {
    return {
      recruitmentStatus: raw.alimdurum || raw.recruitmentStatus,
      date: raw.kurulustarih || raw.date,
      memberCount: raw.uyesayisi || raw.memberCount
    };
  }
}
