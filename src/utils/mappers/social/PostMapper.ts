import { PostDTO, PostOwnerDTO, PostMediaDTO, PostCommentDTO, PostLikerDTO, Post, PostResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

export class PostMapper extends BaseMapper {
  // ─── V1 ───────────────────────────────────────────────────────────────────

  static mapFeedList(rawList: any[]): Post[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => this.mapFeedPost(item));
  }

  static mapFeedPost(raw: any): Post {
    const legacy = this.shouldReturnRaw<PostDTO>(raw);
    if (legacy) return new Post(legacy);
    if (!raw) return new Post({} as PostDTO);

    return new Post({
      id: this.toNumber(raw.postID),
      owner: this.mapOwner(raw.owner || {}),
      content: raw.paylasimicerik || '',
      location: raw.paylasimkonum,
      date: raw.paylasimzaman || '',
      timeLabel: raw.paylasimzamangecen,
      editDate: null,
      likesCount: this.toNumber(raw.begenisay),
      commentsCount: this.toNumber(raw.yorumsay),
      repostsCount: this.toNumber(raw.repostsay),
      reportsCount: this.toNumber(raw.sikayetsay),
      isLiked: this.toBool(raw.benbegendim),
      isCommented: this.toBool(raw.benyorumladim),
      isReposted: this.toBool(raw.benretweetledim),
      isReported: this.toBool(raw.bensikayet),
      device: (raw.device === 'mobil' || Number(raw.paylasimcihaz || raw.cihaz) === 1) ? 'mobile' : 'web',
      mappedMedia: this.mapMediaList(raw.paylasimfoto || []),
      topLikers: this.mapLikersList(raw.paylasimilkucbegenen || []),
      topComments: this.mapCommentList(raw.ilkucyorum || [])
    });
  }

  // ─── V2 ───────────────────────────────────────────────────────────────────

  static mapFeedListV2(rawList: any[]): Post[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => this.mapFeedPostV2(item));
  }

  static mapFeedPostV2(raw: any): Post {
    if (!raw) return new Post({} as PostDTO);

    return new Post({
      id: this.toNumber(raw.post_ID),
      owner: this.mapOwner(raw.owner || {}),
      content: raw.content || '',
      location: raw.location || undefined,
      date: raw.published_at || '',
      timeLabel: raw.published_ago,
      editDate: raw.edited_ago ?? null,
      likesCount: this.toNumber(raw.like_count),
      commentsCount: this.toNumber(raw.comment_count),
      repostsCount: this.toNumber(raw.repost_count),
      reportsCount: this.toNumber(raw.report_count),
      isLiked: this.toBool(raw.liked_by_me),
      isCommented: this.toBool(raw.commented_by_me),
      isReposted: this.toBool(raw.reposted_by_me),
      isReported: this.toBool(raw.reported_by_me),
      device: raw.device === 'mobil' ? 'mobile' : 'web',
      mappedMedia: this.mapMediaListV2(raw.media || []),
      topLikers: this.mapLikersList(raw.first_likers || []),
      topComments: this.mapCommentListV2(raw.first_comments || [])
    });
  }

  // ─── Shared owner mapper (works for both V1 and V2) ──────────────────────

  private static mapOwner(raw: any): PostOwnerDTO {
    return {
      id: this.toNumber(raw.owner_ID || raw.id),
      username: raw.username || '',
      displayName: raw.displayname || '',
      avatar: this.toImageUrl(raw.avatar) || '',
      banner: this.toImageUrl(raw.banner) || '',
      url: raw.URL || '',
      job: raw.job || ''
    };
  }

  // ─── V1 media ─────────────────────────────────────────────────────────────

  private static mapMediaOwnerV1(raw: any): PostOwnerDTO {
    return {
      id: this.toNumber(raw.owner_ID),
      username: raw.owner_username || '',
      displayName: raw.owner_displayname || '',
      avatar: this.toImageUrl(raw.owner_avatar) || '',
      url: raw.URL || ''
    };
  }

  private static mapMediaList(rawList: any[]): PostMediaDTO[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      id: this.toNumber(item.fotoID),
      owner: this.mapMediaOwnerV1(item.owner || {}),
      category: item.paylasimkategori || '',
      url: this.toImageUrl(item.fotourl) || '',
      smallUrl: this.toImageUrl(item.fotoufakurl) || '',
      thumbnailUrl: this.toImageUrl(item.fotominnakurl) || '',
      orientation: item.medyayonu || 'landscape'
    }));
  }

  // ─── V2 media ─────────────────────────────────────────────────────────────

  private static mapMediaOwnerV2(raw: any): PostOwnerDTO {
    return {
      id: this.toNumber(raw.owner_ID),
      username: raw.username || '',
      displayName: raw.displayname || '',
      avatar: this.toImageUrl(raw.avatar) || '',
      url: ''
    };
  }

  private static mapMediaListV2(rawList: any[]): PostMediaDTO[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      id: this.toNumber(item.media_ID),
      owner: this.mapMediaOwnerV2(item.owner || {}),
      category: item.category || '',
      url: item.media_bigURL || '',
      smallUrl: item.media_URL || '',
      thumbnailUrl: item.media_minURL || '',
      orientation: item.orientation || 'landscape'
    }));
  }

  // ─── Likers (V1 only for now) ─────────────────────────────────────────────

  static mapLikersList(rawList: any[]): PostLikerDTO[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      likeId: this.toNumber(item.begeni_ID),
      id: this.toNumber(item.begenenID || item.ID),
      displayName: item.begenenadi || item.adsoyad || '',
      username: item.begenenkullaniciadi || item.kullaniciadi || '',
      avatar: this.toImageUrl(item.begenenavatar || item.avatar) || '',
      url: item.URL || '',
      date: item.begenmezaman || item.begeni_zaman || ''
    }));
  }

  // ─── V1 comments ──────────────────────────────────────────────────────────

  static mapCommentList(rawList: any[]): PostCommentDTO[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      postId: this.toNumber(item.paylasimID),
      id: this.toNumber(item.yorumID),
      authorId: this.toNumber(item.yorumcuid),
      authorUsername: item.yorumcukullaniciad || '',
      authorDisplayName: item.yorumcuadsoyad || '',
      authorAvatar: this.toImageUrl(item.yorumcuavatar) || '',
      content: item.yorumcuicerik || '',
      date: item.yorumcuzaman || '',
      likesCount: this.toNumber(item.yorumbegenisayi),
      reportsCount: this.toNumber(item.yorumsikayetsayi),
      isLiked: this.toBool(item.benbegendim),
      isReported: this.toBool(item.bensikayet)
    }));
  }

  // ─── V2 comments ──────────────────────────────────────────────────────────

  static mapCommentListV2(rawList: any[]): PostCommentDTO[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      postId: this.toNumber(item.post_ID),
      id: this.toNumber(item.comment_ID),
      authorId: this.toNumber(item.user_ID),
      authorUsername: item.username || '',
      authorDisplayName: item.displayname || '',
      authorAvatar: this.toImageUrl(item.avatar) || '',
      content: item.content || '',
      date: item.created_at || '',
      likesCount: this.toNumber(item.like_count),
      reportsCount: this.toNumber(item.report_count),
      isLiked: this.toBool(item.liked_by_me),
      isReported: this.toBool(item.reported_by_me)
    }));
  }
}
