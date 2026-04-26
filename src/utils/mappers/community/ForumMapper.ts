import { ForumCategoryDTO, ForumTopicDTO, ForumCategory, ForumTopic } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Forum categories and topics.
 */
export class ForumMapper extends BaseMapper {
  static mapCategory(raw: any): ForumCategory {
    if (!raw) return new ForumCategory({} as ForumCategoryDTO);

    return new ForumCategory({
      id: this.toNumber(raw.kategoriID || raw.id),
      name: raw.kategoriadi || raw.name || '',
      description: raw.kategoriaciklama || raw.description,
      topicCount: this.toNumber(raw.konusayisi || raw.topicCount),
      postCount: this.toNumber(raw.mesajsayisi || raw.postCount),
      slug: raw.kategorilink || raw.slug
    });
  }

  static mapCategoryList(rawList: any[]): ForumCategory[] {
    return (rawList || []).map(item => this.mapCategory(item));
  }

  static mapTopic(raw: any): ForumTopic {
    if (!raw) return new ForumTopic({} as ForumTopicDTO);

    return new ForumTopic({
      id: this.toNumber(raw.konuID || raw.id),
      title: raw.konubaslik || raw.title || '',
      content: raw.konuicerik || raw.content,
      authorId: this.toNumber(raw.yazarID || raw.authorId),
      authorName: raw.yazaradi || raw.authorName || '',
      date: raw.zaman || raw.date || '',
      viewCount: this.toNumber(raw.goruntulenme || raw.viewCount),
      replyCount: this.toNumber(raw.cevapsayisi || raw.replyCount),
      isLocked: this.toBool(raw.kilitli || raw.isLocked),
      isPinned: this.toBool(raw.sabit || raw.isPinned)
    });
  }

  static mapTopicList(rawList: any[]): ForumTopic[] {
    return (rawList || []).map(item => this.mapTopic(item));
  }
}
