/**
 * Unique response interface for api.groups.getGroups()
 */

export interface GroupItem {
  group_ID: number;
  group_name: string;
  group_URL: string;
  group_logo: string;
  group_label: string;
  group_motto: string;
}

export interface GetGroupsResponse {
  icerik: GroupItem[];
  durum: number;
  aciklama: string;
  kod: number;
}
