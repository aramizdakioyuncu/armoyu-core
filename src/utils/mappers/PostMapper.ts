import { ArmoyuPost, ArmoyuPostOwner } from '../../models/social/GetPostsResponse';
import { BaseMapper } from './BaseMapper';
import { CommentMapper } from './comment-mapper';

/**
 * Mapper for Social Posts.
 */
export class PostMapper extends BaseMapper {
  static mapPostOwner(raw: any, usePreviousVersion: boolean = false): ArmoyuPostOwner {
    const legacy = this.shouldReturnRaw<ArmoyuPostOwner>(raw, usePreviousVersion);
    if (legacy) return legacy;
    if (!raw) return {} as ArmoyuPostOwner;

    return {
      id: this.toNumber(raw.ID || raw.id),
      displayName: raw.adsoyad || raw.displayName,
      username: raw.kullaniciadi || raw.username,
      avatar: raw.avatar,
      url: raw.URL || raw.url
    };
  }

  static mapPost(raw: any, usePrevious: boolean = false): ArmoyuPost {
    const legacy = this.shouldReturnRaw<ArmoyuPost>(raw, usePrevious);
    if (legacy) return legacy;
    if (!raw) return {} as ArmoyuPost;

    return {
      id: this.toNumber(raw.paylasimID || raw.id || raw.ID || raw.postID),
      owner: this.mapPostOwner(raw.yayinliyanad || raw.owner, false),
      content: raw.paylasimicerik || raw.content || raw.icerik,
      location: raw.paylasimkonum || raw.location,
      date: raw.paylasimzaman || raw.date,
      timeLabel: raw.paylasimzamangecen || raw.timeLabel,
      editDate: raw.paylasimzamanedit || raw.editDate,
      topLikers: (raw.paylasimilkucbegenen || raw.topLikers || []).map((l: any) => this.mapPostLiker(l)),
      ...this.mapPostStats(raw),
      ...this.mapPostFlags(raw),
      media: (raw.paylasimfoto || raw.media || []).map((m: any) => this.mapPostMedia(m)),
      topComments: (raw.ilkucyorum || raw.topComments || []).map((c: any) => CommentMapper.mapComment(c, usePrevious))
    };
  }

  static mapPostStats(raw: any) {
    return {
      likesCount: this.toNumber(raw.begenisay || raw.likesCount),
      commentsCount: this.toNumber(raw.yorumsay || raw.commentsCount),
      repostsCount: this.toNumber(raw.repostsay || raw.repostsCount),
      reportsCount: this.toNumber(raw.sikayetsay || raw.reportsCount)
    };
  }

  static mapPostFlags(raw: any) {
    return {
      isLiked: this.toBool(raw.benbegendim || raw.isLiked),
      isCommented: this.toBool(raw.benyorumladim || raw.isCommented),
      isReposted: this.toBool(raw.benretweetledim || raw.isReposted),
      isReported: this.toBool(raw.bensikayet || raw.isReported)
    };
  }

  static mapPostMedia(m: any) {
    return {
      id: this.toNumber(m.fotoID || m.id),
      owner: m.owner ? this.mapPostOwner(m.owner) : undefined,
      category: m.paylasimkategori || m.category,
      url: m.fotourl || m.url,
      smallUrl: m.fotoufakurl || m.smallUrl,
      thumbnailUrl: m.fotominnakurl || m.thumbnailUrl,
      orientation: m.medyayonu || m.orientation
    };
  }

  static mapPostLiker(liker: any) {
    return {
      likeId: liker.begeni_ID || liker.likeId,
      id: liker.ID || liker.id,
      displayName: liker.adsoyad || liker.displayName,
      username: liker.kullaniciadi || liker.username,
      avatar: liker.avatar,
      url: liker.URL || liker.url,
      date: liker.begeni_zaman || liker.date
    };
  }
}
