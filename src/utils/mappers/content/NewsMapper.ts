import { NewsDTO, News } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for News and Blog related API responses.
 * Strict mapping: Targeting exact API fields for V1.
 */
export class NewsMapper extends BaseMapper {
  static mapNews(raw: any): News {
    const legacy = this.shouldReturnRaw<NewsDTO>(raw);
    if (legacy) return new News(legacy);
    if (!raw) return new News({} as NewsDTO);

    return new News({
      id: this.toNumber(raw.haberID),
      title: raw.haberbaslik,
      summary: raw.ozet,
      category: raw.kategori,
      views: this.toNumber(raw.goruntulen),
      author: raw.yazar,
      date: raw.zaman,
      url: raw.link,
      thumbnail: this.toImageUrl(raw.resim)
    });
  }

  static mapNewsList(rawList: any[]): News[] {
    return (rawList || []).map(item => this.mapNews(item));
  }
}
