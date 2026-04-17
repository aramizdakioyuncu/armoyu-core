import { User } from '../models/auth/User';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { UserProfileService } from './user/UserProfileService';
import { UserSocialService } from './user/UserSocialService';
import { UserMediaService } from './user/UserMediaService';
import { UserNotificationService } from './user/UserNotificationService';
import { UserRankingService } from './user/UserRankingService';
import { UserLifeService } from './user/UserLifeService';

export class UserService extends BaseService {
  private readonly _profile: UserProfileService;
  private readonly _social: UserSocialService;
  private readonly _media: UserMediaService;
  private readonly _notifications: UserNotificationService;
  private readonly _rankings: UserRankingService;
  private readonly _life: UserLifeService;

  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
    this._profile = new UserProfileService(client, logger, usePreviousVersion);
    this._social = new UserSocialService(client, logger, usePreviousVersion);
    this._media = new UserMediaService(client, logger, usePreviousVersion);
    this._notifications = new UserNotificationService(client, logger, usePreviousVersion);
    this._rankings = new UserRankingService(client, logger, usePreviousVersion);
    this._life = new UserLifeService(client, logger, usePreviousVersion);
  }

  // Profile
  getUserByUsername(u: string) { return this._profile.getUserByUsername(u); }
  getSocialProfile(id?: number) { return this._profile.getSocialProfile(id); }
  updateProfile(d: Partial<User>) { return this._profile.updateProfile(d); }
  updatePrivatePersonalInfo(d: any) { return this._profile.updatePrivatePersonalInfo(d); }
  setFavoriteTeam(id: number) { return this._profile.setFavoriteTeam(id); }
  requestEmailVerificationUrl(id?: number) { return this._profile.requestEmailVerificationUrl(id); }
  getPermissions() { return this._profile.getPermissions(); }

  // Social
  search(q: string) { return this._social.search(q); }
  toggleFollow(id: string) { return this._social.toggleFollow(id); }
  addFriend(id: number) { return this._social.addFriend(id); }
  removeFriend(id: number) { return this._social.removeFriend(id); }
  respondToFriendRequest(id: number, c: number) { return this._social.respondToFriendRequest(id, c); }
  getFriendsList(p: number, params: any = {}) { return this._social.getFriendsList(p, params); }
  pokeFriend(id: number) { return this._social.pokeFriend(id); }

  // Media
  getUserMedia(p: number, params: any = {}) { return this._media.getUserMedia(p, params); }
  uploadMedia(f: any, c: any) { return this._media.uploadMedia(f, c); }
  deleteMedia(id: number) { return this._media.deleteMedia(id); }
  rotateMedia(id: number, d: number) { return this._media.rotateMedia(id, d); }
  updateAvatar(i: any) { return this._media.updateAvatar(i); }
  resetAvatar() { return this._media.resetAvatar(); }
  updateBackground(i: any) { return this._media.updateBackground(i); }
  resetBanner() { return this._media.resetBanner(); }

  // Notifications
  getNotifications() { return this._notifications.getNotifications(); }
  getNotificationsHistory(p: any, l: any, c: any, s: any) { return this._notifications.getNotificationsHistory(p, l, c, s); }
  getNotificationSettings() { return this._notifications.getNotificationSettings(); }
  updateNotificationSettings(s: any) { return this._notifications.updateNotificationSettings(s); }

  // Rankings
  getXpRankings(p: number = 1) { return this._rankings.getXpRankings(p); }
  getPopRankings(p: number = 1) { return this._rankings.getPopRankings(p); }

  // Life
  getUserSchools(id?: number) { return this._life.getUserSchools(id); }
  getSchoolDetail(id: number) { return this._life.getSchoolDetail(id); }
  getInvitationsList(p: number = 1) { return this._life.getInvitationsList(p); }
  refreshInviteCode() { return this._life.refreshInviteCode(); }
}
