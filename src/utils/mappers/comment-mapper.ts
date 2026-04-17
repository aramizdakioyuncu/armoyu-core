import { ArmoyuPostComment } from '../../models/social/GetPostsResponse';
import { BaseMapper } from './BaseMapper';

/**
 * Mapper for Social Comments.
 */
export class CommentMapper extends BaseMapper {
  static mapComment(raw: any, usePrevious: boolean = false): ArmoyuPostComment {
    const legacy = this.shouldReturnRaw<ArmoyuPostComment>(raw, usePrevious);
    if (legacy) return legacy;
    if (!raw) return {} as ArmoyuPostComment;

    return {
      postId: this.toNumber(raw.paylasimID || raw.postId),
      id: this.toNumber(raw.yorumID || raw.id),
      ...this.mapCommentAuthor(raw),
      content: raw.yorumcuicerik || raw.content,
      date: raw.yorumcuzaman || raw.date,
      timeLabel: raw.yorumcuzamangecen || raw.timeLabel,
      replyTo: raw.yorumcukimeyanit || raw.replyTo,
      ...this.mapCommentStats(raw),
      ...this.mapCommentFlags(raw)
    };
  }

  static mapCommentAuthor(raw: any) {
    return {
      authorId: raw.yorumcuid || raw.authorId,
      authorTag: raw.yorumcuetiketad || raw.authorTag,
      authorUsername: raw.yorumcukullaniciad || raw.authorUsername,
      authorDisplayName: raw.yorumcuadsoyad || raw.authorDisplayName,
      authorAvatar: raw.yorumcuavatar || raw.authorAvatar,
      authorLink: raw.oyunculink || raw.authorLink,
      authorSmallAvatar: raw.yorumcuufakavatar || raw.authorSmallAvatar,
      authorThumbnailAvatar: raw.yorumcuminnakavatar || raw.authorThumbnailAvatar
    };
  }

  static mapCommentStats(raw: any) {
    return {
      likesCount: this.toNumber(raw.yorumbegenisayi || raw.likesCount),
      reportsCount: this.toNumber(raw.yorumsikayetsayi || raw.reportsCount)
    };
  }

  static mapCommentFlags(raw: any) {
    return {
      isLiked: this.toBool(raw.benbegendim || raw.isLiked),
      isReported: this.toBool(raw.bensikayet || raw.isReported)
    };
  }
}
