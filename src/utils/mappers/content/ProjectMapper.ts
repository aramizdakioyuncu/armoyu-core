import { ProjectDTO, ProjectScoreDTO, ProjectMemberDTO, Project, ModDTO, Mod } from '../../../models';
import { BaseMapper } from '../BaseMapper';

export class ProjectMapper extends BaseMapper {
  static mapProject(raw: any): Project {
    const legacy = this.shouldReturnRaw<ProjectDTO>(raw);
    if (legacy) return new Project(legacy);
    if (!raw) return new Project({} as ProjectDTO);

    const members: ProjectMemberDTO[] = Array.isArray(raw.project_members)
      ? raw.project_members.map((m: any) => this.mapMember(m))
      : [];

    return new Project({
      id: this.toNumber(raw.project_ID || raw.projeID || raw.id || raw.ID),
      name: raw.project_name || raw.projeadi || raw.name || raw.Value || '',
      description: raw.project_description || raw.projeaciklama || raw.description,
      version: raw.project_version,
      link: raw.project_link || raw.projelink,
      shortname: raw.project_shortname,
      downloads: this.toNumber(raw.project_downloads),
      apiId: raw.project_apiID,
      contact: raw.project_contact,
      privacyPolicy: raw.project_privacy_policy,
      logo: this.toImageUrl(raw.project_logo) || this.toImageUrl(raw.projelogo),
      banner: this.toImageUrl(raw.projebanner),
      url: raw.project_shortname || raw.projelink || raw.url,
      category: raw.projekategori,
      status: raw.project_status !== undefined ? String(raw.project_status) : String(raw.projedurum || ''),
      language: raw.project_language
        ? { id: this.toNumber(raw.project_language.language_ID), name: raw.project_language.language_name || '' }
        : undefined,
      owner: raw.project_owner && raw.project_owner.group_ID
        ? {
            groupId: this.toNumber(raw.project_owner.group_ID),
            groupName: raw.project_owner.group_name,
            groupShortname: raw.project_owner.group_shortname,
            groupUrl: raw.project_owner.group_URL,
            groupLogo: this.toImageUrl(raw.project_owner.group_logo)
          }
        : undefined,
      members
    });
  }

  static mapMember(m: any): ProjectMemberDTO {
    return {
      rowId: this.toNumber(m.member_rowID),
      role: this.toString(m.member_role),
      type: this.toString(m.member_type),
      joinTime: this.toString(m.member_jointime),
      playerId: this.toNumber(m.player_ID),
      username: this.toString(m.player_userlogin),
      displayName: this.toString(m.player_displayname),
      avatar: this.toImageUrl(m.player_avatar)
    };
  }

  static mapMemberList(rawList: any[]): ProjectMemberDTO[] {
    return (rawList || []).map(item => this.mapMember(item));
  }

  static mapProjectList(rawList: any[]): Project[] {
    return (rawList || []).map(item => this.mapProject(item));
  }

  static mapMod(raw: any): Mod {
    const legacy = this.shouldReturnRaw<ModDTO>(raw);
    if (legacy) return new Mod(legacy);
    if (!raw) return new Mod({} as ModDTO);

    return new Mod({
      id: this.toNumber(raw.modID || raw.id || raw.ID),
      name: raw.modadi || raw.name || raw.Value || '',
      version: raw.modversiyon || raw.version,
      gameId: this.toNumber(raw.oyunID || raw.gameId),
      description: raw.modaciklama || raw.description,
      logo: this.toImageUrl(raw.modlogo),
      downloadUrl: raw.modlink || raw.downloadUrl,
      authorId: this.toNumber(raw.yazarID),
      authorName: raw.yazaradi
    });
  }

  static mapModList(rawList: any[]): Mod[] {
    return (rawList || []).map(item => this.mapMod(item));
  }

  static mapScore(raw: any): ProjectScoreDTO {
    // V2: score_player object; V1: flat fields
    if (raw.score_player) {
      return {
        rank: this.toNumber(raw['#']),
        playerId: this.toNumber(raw.score_player.player_ID),
        playerName: raw.score_player.player_displayname || raw.score_player.player_userlogin || '',
        score: this.toNumber(raw.score_data ?? raw.score_value ?? raw.score_score),
        date: raw.score_date || raw.zaman || ''
      };
    }
    return {
      rank: this.toNumber(raw['#']),
      playerId: this.toNumber(raw.oyuncuid),
      playerName: raw.oyuncuadsoyad || '',
      score: this.toNumber(raw.skor),
      date: raw.zaman || ''
    };
  }

  static mapScoreList(rawList: any[]): ProjectScoreDTO[] {
    return (rawList || []).map(item => this.mapScore(item));
  }
}
