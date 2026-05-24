export interface ProjectLanguageDTO {
  id: number;
  name: string;
}

export interface ProjectOwnerDTO {
  groupId?: number;
  groupName?: string;
  groupShortname?: string;
  groupUrl?: string;
  groupLogo?: string;
}

export interface ProjectMemberDTO {
  rowId: number;
  role: string;
  type: string;
  joinTime: string;
  playerId: number;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface ProjectDTO {
  id: number;
  name: string;
  description?: string;
  version?: string;
  link?: string;
  shortname?: string;
  downloads?: number;
  apiId?: string;
  contact?: string;
  privacyPolicy?: string;
  logo?: string;
  banner?: string;
  url?: string;
  category?: string;
  status?: string;
  language?: ProjectLanguageDTO;
  owner?: ProjectOwnerDTO;
  members?: ProjectMemberDTO[];
}

export interface ModDTO {
  id: number;
  name: string;
  version?: string;
  gameId?: number;
  description?: string;
  logo?: string;
  downloadUrl?: string;
  authorId?: number;
  authorName?: string;
}

export interface ProjectScoreDTO {
  rank: number;
  playerId: number;
  playerName: string;
  score: number;
  date: string;
}
