import { GroupItem } from './GetGroupsResponse';

/**
 * Unique response interface for api.groups.getUserGroups()
 */
export interface GetUserGroupsResponse {
  icerik: GroupItem[];
  kod: number;
  durum: number;
  aciklama: string;
}
