import { PostResponse, PostOwnerResponse, PostMediaResponse, PostCommentResponse, PostLikerResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Social Posts and Feed.
 */
export class PostMapper extends BaseMapper {
  /**
   * Specifically for the main Social Feed list.
   */
  static mapFeedList(rawList: any[]): PostResponse[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => this.mapFeedPost(item));
  }

  /**
   * Specifically for a single Social Post.
   */
  static mapFeedPost(raw: any): PostResponse {
    const legacy = this.shouldReturnRaw<PostResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as PostResponse;

    return {
      id: this.toNumber(raw.postID),
      owner: this.mapOwner(raw.owner || {}),
      content: raw.paylasimicerik || '',
      location: raw.paylasimkonum,
      date: raw.paylasimzaman || '',
      timeLabel: raw.paylasimzamangecen,
      likesCount: this.toNumber(raw.begenisay),
      commentsCount: this.toNumber(raw.yorumsay),
      repostsCount: this.toNumber(raw.repostsay),
      reportsCount: this.toNumber(raw.sikayetsay),
      isLiked: this.toBool(raw.benbegendim),
      isCommented: this.toBool(raw.benyorumladim),
      isReposted: this.toBool(raw.benretweetledim),
      isReported: this.toBool(raw.bensikayet),
      mappedMedia: this.mapMediaList(raw.paylasimfoto || []),
      topLikers: [],
      topComments: this.mapCommentList(raw.ilkucyorum || [])
    };
  }

  private static mapOwner(raw: any): PostOwnerResponse {
    return {
      id: this.toNumber(raw.owner_ID || raw.id),
      username: raw.username || '',
      displayName: raw.displayname || '',
      avatar: this.toImageUrl(raw.avatar) || '',
      banner: this.toImageUrl(raw.banner) || '',
      url: raw.URL || ''
    };
  }

  private static mapMediaList(rawList: any[]): PostMediaResponse[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      id: this.toNumber(item.fotoID),
      owner: this.mapOwner(item.owner || {}),
      category: item.paylasimkategori || '',
      url: this.toImageUrl(item.fotourl) || '',
      smallUrl: this.toImageUrl(item.fotoufakurl) || '',
      thumbnailUrl: this.toImageUrl(item.fotominnakurl) || '',
      orientation: item.medyayonu || 'landscape'
    }));
  }

  static mapLikersList(rawList: any[]): PostLikerResponse[] {
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

  static mapCommentList(rawList: any[]): PostCommentResponse[] {
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
}
