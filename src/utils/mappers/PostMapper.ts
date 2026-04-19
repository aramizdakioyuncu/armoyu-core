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
      displayName: raw.adsoyad || raw.displayName || raw.displayname || raw.ad,
      username: raw.kullaniciadi || raw.username || raw.kullaniciad,
      avatar: this.toImageUrl(raw.oyuncuavatar || raw.avatar || raw.kullaniciavatar) || '',
      url: raw.URL || raw.url,
      
      // Legacy compatibility keys for UI mapping
      adsoyad: raw.adsoyad || raw.displayName || raw.displayname || raw.ad,
      kullaniciadi: raw.kullaniciadi || raw.username || raw.kullaniciad,
      displayname: raw.adsoyad || raw.displayName || raw.displayname || raw.ad
    };
  }

  static mapPost(raw: any, usePrevious: boolean = false): ArmoyuPost {
    const legacy = this.shouldReturnRaw<ArmoyuPost>(raw, usePrevious);
    if (legacy) return legacy;
    if (!raw) return {} as ArmoyuPost;

    return {
      id: this.toNumber(raw.paylasimID || raw.id || raw.ID || raw.postID),
      owner: this.mapPostOwner(raw.owner || { 
        adsoyad: raw.yayinlayanadsoyad || raw.yayinlayanad, 
        kullaniciadi: raw.yayinliyanad 
      }, false),
      content: raw.paylasimicerik || raw.content || raw.icerik,
      location: raw.paylasimkonum || raw.location,
      date: raw.paylasimzaman || raw.date,
      timeLabel: raw.paylasimzamangecen || raw.timeLabel,
      
      // Legacy compatibility keys for UI mapping
      paylasimzaman: raw.paylasimzaman || raw.date,
      paylasimzamangecen: raw.paylasimzamangecen || raw.timeLabel,
      paylasimicerik: raw.paylasimicerik || raw.content || raw.icerik,
      
      editDate: raw.paylasimzamanedit || raw.editDate,
      topLikers: (raw.paylasimilkucbegenen || raw.topLikers || []).map((l: any) => this.mapPostLiker(l)),
      ...this.mapPostStats(raw),
      ...this.mapPostFlags(raw),
      mappedMedia: (raw.paylasimfoto || raw.media || []).map((m: any) => this.mapPostMedia(m)),
      paylasimfoto: (raw.paylasimfoto || raw.media || []).map((m: any) => ({
        id: this.toNumber(m.fotoID || m.id),
        fotourl: this.toImageUrl(m.fotourl || m.url),
        fotoufakurl: this.toImageUrl(m.fotoufakurl || m.smallUrl),
        fotominnakurl: this.toImageUrl(m.fotominnakurl || m.thumbnailUrl)
      })),
      topComments: (raw.ilkucyorum || raw.topComments || []).map((c: any) => CommentMapper.mapComment(c, usePrevious))
    };
  }

  static mapPostStats(raw: any) {
    const l = this.toNumber(raw.begenisay || raw.likesCount);
    const c = this.toNumber(raw.yorumsay || raw.commentsCount);
    const r = this.toNumber(raw.repostsay || raw.repostsCount);
    const rep = this.toNumber(raw.sikayetsay || raw.reportsCount);
    
    return {
      likesCount: l,
      commentsCount: c,
      repostsCount: r,
      reportsCount: rep,
      likeCount: l,
      commentCount: c,
      repostCount: r,
      reportCount: rep
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
      url: this.toImageUrl(m.fotourl || m.url),
      smallUrl: this.toImageUrl(m.fotoufakurl || m.smallUrl),
      thumbnailUrl: this.toImageUrl(m.fotominnakurl || m.thumbnailUrl),
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
