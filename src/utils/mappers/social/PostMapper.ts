import { PostDTO, PostOwnerDTO, PostMediaDTO, PostCommentDTO, PostLikerDTO, Post, PostResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Social Posts and Feed.
 */
export class PostMapper extends BaseMapper {
  /**
   * Specifically for the main Social Feed list.
   */
  static mapFeedList(rawList: any[]): Post[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => this.mapFeedPost(item));
  }

  /**
   * Specifically for a single Social Post.
   */
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
      likesCount: this.toNumber(raw.begenisay),
      commentsCount: this.toNumber(raw.yorumsay),
      repostsCount: this.toNumber(raw.repostsay),
      reportsCount: this.toNumber(raw.sikayetsay),
      isLiked: this.toBool(raw.benbegendim),
      isCommented: this.toBool(raw.benyorumladim),
      isReposted: this.toBool(raw.benretweetledim),
      isReported: this.toBool(raw.bensikayet),
      mappedMedia: this.mapMediaList(raw.paylasimfoto || []),
      topLikers: this.mapLikersList(raw.paylasimilkucbegenen || []),
      topComments: this.mapCommentList(raw.ilkucyorum || [])
    });
  }

  private static mapOwner(raw: any): PostOwnerDTO {
    return {
      id: this.toNumber(raw.owner_ID || raw.id),
      username: raw.username || '',
      displayName: raw.displayname || '',
      avatar: raw.avatar?.media_URL || this.toImageUrl(raw.avatar) || '',
      banner: raw.banner?.media_URL || this.toImageUrl(raw.banner) || '',
      url: raw.URL || '',
      job: raw.job || ''
    };
  }

  private static mapMediaOwner(raw: any): PostOwnerDTO {
    return {
      id: this.toNumber(raw.owner_ID),
      username: raw.owner_username || '',
      displayName: raw.owner_displayname || '',
      avatar: raw.owner_avatar?.media_URL || this.toImageUrl(raw.owner_avatar) || '',
      url: raw.URL || ''
    };
  }

  private static mapMediaList(rawList: any[]): PostMediaDTO[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      id: this.toNumber(item.fotoID),
      owner: this.mapMediaOwner(item.owner || {}),
      category: item.paylasimkategori || '',
      url: this.toImageUrl(item.fotourl) || '',
      smallUrl: this.toImageUrl(item.fotoufakurl) || '',
      thumbnailUrl: this.toImageUrl(item.fotominnakurl) || '',
      orientation: item.medyayonu || 'landscape'
    }));
  }

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
}
