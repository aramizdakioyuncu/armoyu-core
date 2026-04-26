import { GroupDTO, Group } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Group and Clan related data.
 * Specialized by Page (List vs Detail) to handle API field variations.
 */
export class GroupMapper extends BaseMapper {
  /**
   * Specifically for Group List pages.
   */
  static mapGroupListItem(raw: any): Group {
    const legacy = this.shouldReturnRaw<GroupDTO>(raw);
    if (legacy) return new Group(legacy);
    if (!raw) return new Group({} as GroupDTO);

    return new Group({
      id: this.toNumber(raw.grupID || raw.group_ID),
      name: raw.grupad || raw.group_name,
      displayName: raw.grupadi || raw.group_name,
      tag: raw.grupetiket || raw.group_shortname,
      logo: this.toImageUrl(raw.gruplogo || raw.group_logo?.media_URL),
      banner: this.toImageUrl(raw.gruparplan || raw.group_banner?.media_URL),
      memberCount: this.toNumber(raw.grupuyesayisi || raw.group_membercount),
      url: raw.grup_URL || raw.group_URL
    });
  }

  /**
   * Specifically for Group Detail page.
   */
  static mapGroupDetail(raw: any): Group {
    const legacy = this.shouldReturnRaw<GroupDTO>(raw);
    if (legacy) return new Group(legacy);
    if (!raw) return new Group({} as GroupDTO);

    // Detail usually has richer nested objects
    const logoUrl = typeof raw.group_logo === 'object' ? (raw.group_logo.media_URL || raw.group_logo.media_minURL) : raw.gruplogo;
    const bannerUrl = typeof raw.group_banner === 'object' ? (raw.group_banner.media_URL || raw.group_banner.media_minURL) : raw.gruparplan;

    return new Group({
      id: this.toNumber(raw.group_ID || raw.grupID),
      name: raw.group_name || raw.grupad,
      displayName: raw.group_name || raw.grupadi,
      description: raw.group_description || raw.grupaciklama,
      tag: raw.group_shortname || raw.grupetiket,
      logo: this.toImageUrl(logoUrl),
      banner: this.toImageUrl(bannerUrl),
      memberCount: this.toNumber(raw.group_membercount || raw.grupuyesayisi),
      role: raw.gruprol,
      category: raw.group_category || raw.grupkategori,
      url: raw.group_URL || raw.grup_URL,
      isPrivate: this.toBool(raw.group_joinstatus === 2 || raw.gruppriv),
      isVerified: this.toBool(raw.grupdoğrulanmış),
      registrationDate: raw.group_registered || raw.grupkayittarih,
      founder: raw.group_owner ? raw.group_owner.player_displayname : raw.grupkurucu,
      socials: {
        discord: raw.group_social?.group_discord || raw.discordlink,
        website: raw.group_social?.group_website || raw.website
      }
    });
  }

  static mapGroupList(rawList: any[]): Group[] {
    return (rawList || []).map(group => this.mapGroupListItem(group));
  }
}
