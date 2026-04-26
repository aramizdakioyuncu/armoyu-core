import { ProjectDTO, ProjectScoreDTO, Project, ModDTO, Mod } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Projects, Mods and related content.
 */
export class ProjectMapper extends BaseMapper {
  static mapProject(raw: any): Project {
    const legacy = this.shouldReturnRaw<ProjectDTO>(raw);
    if (legacy) return new Project(legacy);
    if (!raw) return new Project({} as ProjectDTO);

    return new Project({
      id: this.toNumber(raw.projeID || raw.id || raw.ID),
      name: raw.projeadi || raw.name || raw.Value || '',
      description: raw.projeaciklama || raw.description,
      logo: this.toImageUrl(raw.projelogo),
      banner: this.toImageUrl(raw.projebanner),
      url: raw.projelink || raw.url,
      category: raw.projekategori,
      status: String(raw.projedurum || '')
    });
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
