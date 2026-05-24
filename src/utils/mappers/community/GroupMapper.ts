import { GroupDTO, GroupMemberDTO, Group, GroupMember } from '../../../models';
import { BaseMapper } from '../BaseMapper';

export class GroupMapper extends BaseMapper {
  static mapGroupListItem(raw: any): Group {
    const legacy = this.shouldReturnRaw<GroupDTO>(raw);
    if (legacy) return new Group(legacy);
    if (!raw) return new Group({} as GroupDTO);

    return new Group({
      id: this.toNumber(raw.grupID || raw.group_ID),
      name: raw.grupad || raw.group_name || '',
      displayName: raw.grupadi || raw.group_name || '',
      tag: raw.grupetiket || raw.group_shortname,
      description: raw.grupaciklama || raw.group_description,
      category: raw.grupkategori || raw.group_category,
      logo: this.toImageUrl(raw.gruplogo || raw.group_logo),
      banner: this.toImageUrl(raw.gruparplan || raw.group_banner),
      memberCount: this.toNumber(raw.grupuyesayisi || raw.group_membercount),
      registrationDate: raw.grupkayittarih || raw.group_registered,
      url: raw.grup_URL || raw.group_URL,
      isPrivate: this.toBool(raw.gruppriv || raw.group_joinstatus === 2),
      founder: raw.group_owner?.player_displayname || raw.grupkurucu,
      socials: {
        discord: raw.group_social?.group_discord || raw.discordlink,
        website: raw.group_social?.group_website || raw.website
      }
    });
  }

  static mapGroupDetail(raw: any): Group {
    const legacy = this.shouldReturnRaw<GroupDTO>(raw);
    if (legacy) return new Group(legacy);
    if (!raw) return new Group({} as GroupDTO);

    return new Group({
      id: this.toNumber(raw.group_ID || raw.grupID),
      name: raw.group_name || raw.grupad || '',
      displayName: raw.group_name || raw.grupadi || '',
      description: raw.group_description || raw.grupaciklama,
      tag: raw.group_shortname || raw.grupetiket,
      logo: this.toImageUrl(raw.group_logo || raw.gruplogo),
      banner: this.toImageUrl(raw.group_banner || raw.gruparplan),
      memberCount: this.toNumber(raw.group_membercount || raw.grupuyesayisi),
      role: raw.gruprol,
      category: raw.group_category || raw.grupkategori,
      url: raw.group_URL || raw.grup_URL,
      isPrivate: this.toBool(raw.group_joinstatus === 2 || raw.gruppriv),
      isVerified: this.toBool(raw.grupdoğrulanmış),
      registrationDate: raw.group_registered || raw.grupkayittarih,
      founder: raw.group_owner?.player_displayname || raw.grupkurucu,
      socials: {
        discord: raw.group_social?.group_discord || raw.discordlink,
        website: raw.group_social?.group_website || raw.website
      }
    });
  }

  /**
   * Maps V2 createGroup response (Turkish field names: adi, baslik, kisaltmaad, etc.)
   */
  static mapGroupCreated(raw: any): Group {
    if (!raw) return new Group({} as GroupDTO);

    return new Group({
      id: this.toNumber(raw.adi),
      name: raw.baslik || '',
      displayName: raw.baslik || '',
      description: raw.acikla,
      tag: raw.kisaltmaad,
      logo: this.toImageUrl(raw.logo),
      banner: this.toImageUrl(raw.foto),
      wallpaper: this.toImageUrl(raw.arkaplan),
      url: raw.url,
      memberCount: this.toNumber(raw.grupuyesayisi),
      recruitmentStatus: raw.grupaliimdurum,
      socials: {
        discord: raw.discord,
        website: raw.gruplarwebsite
      }
    });
  }

  static mapGroupList(rawList: any[]): Group[] {
    return (rawList || []).map(group => this.mapGroupListItem(group));
  }

  static mapMember(raw: any): GroupMember {
    if (!raw) return new GroupMember({} as GroupMemberDTO);
    return new GroupMember({
      id: this.toNumber(raw.player_ID),
      displayName: raw.player_displayname || '',
      username: raw.player_userlogin || '',
      avatar: this.toImageUrl(raw.player_avatar),
      role: raw.player_role
    });
  }

  static mapMemberList(rawList: any[]): GroupMember[] {
    return (rawList || []).map(item => this.mapMember(item));
  }
}
