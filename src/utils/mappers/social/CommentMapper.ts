import { PostCommentResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Social Comments.
 * Version-aware structure: Entry point delegates to specific version mappers.
 */
export class CommentMapper extends BaseMapper {
  static mapComment(raw: any): PostCommentResponse {
    const legacy = this.shouldReturnRaw<PostCommentResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as PostCommentResponse;

    // Route built-in logic: V1 by default
    return this.mapCommentV1(raw);
  }

  // --- VERSION 1 ---

  private static mapCommentV1(raw: any): PostCommentResponse {
    return {
      postId: this.toNumber(raw.paylasimID),
      id: this.toNumber(raw.yorumID),
      authorId: this.toNumber(raw.yorumcuid),
      authorTag: raw.yorumcuetiketad,
      authorUsername: raw.yorumcukullaniciad || '',
      authorDisplayName: raw.yorumcuadsoyad || '',
      authorAvatar: this.toImageUrl(raw.yorumcuavatar) || '',
      authorLink: raw.oyunculink,
      authorSmallAvatar: this.toImageUrl(raw.yorumcuufakavatar),
      authorThumbnailAvatar: this.toImageUrl(raw.yorumcuminnakavatar),
      content: raw.yorumcuicerik || '',
      date: raw.yorumcuzaman || '',
      timeLabel: raw.yorumcuzamangecen,
      replyTo: this.toNumber(raw.yorumcukimeyanit),
      likesCount: this.toNumber(raw.yorumbegenisayi),
      reportsCount: this.toNumber(raw.yorumsikayetsayi),
      isLiked: this.toBool(raw.benbegendim),
      isReported: this.toBool(raw.bensikayet)
    };
  }

  // --- VERSION 2 ---

  private static mapCommentV2(raw: any): PostCommentResponse {
    return this.mapCommentV1(raw);
  }

  static mapCommentList(rawList: any[]): PostCommentResponse[] {
    return (rawList || []).map(item => this.mapComment(item));
  }
}
