import { ForumCategoryDTO, ForumTopicDTO, ForumCategory, ForumTopic } from '../../../models';
import { BaseMapper } from '../BaseMapper';

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

    const creator = raw.topic_creator || {};

    return new ForumTopic({
      id: this.toNumber(raw.topic_ID || raw.id),
      type: raw.topic_type,
      title: raw.topic_title || raw.title || '',
      url: raw.topic_url || raw.url,
      status: this.toNumber(raw.topic_status),
      date: raw.topic_date || raw.date || '',
      content: raw.topic_content || raw.content,
      category: raw.topic_category
        ? { id: this.toNumber(raw.topic_category.id), name: raw.topic_category.name || '', slug: raw.topic_category.slug || '' }
        : undefined,
      creatorId: this.toNumber(creator.player_ID),
      creatorName: creator.player_displayname || '',
      creatorNicename: creator.player_nicename,
      creatorAvatar: this.toImageUrl(creator.player_avatar),
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
