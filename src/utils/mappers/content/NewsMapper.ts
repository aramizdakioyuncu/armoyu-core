import { NewsResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for News and Blog related API responses.
 * Strict mapping: Targeting exact API fields for V1.
 */
export class NewsMapper extends BaseMapper {
  static mapNews(raw: any): NewsResponse {
    const legacy = this.shouldReturnRaw<NewsResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as NewsResponse;

    return {
      id: this.toNumber(raw.haberID),
      title: raw.haberbaslik,
      summary: raw.ozet,
      category: raw.kategori,
      views: this.toNumber(raw.goruntulen),
      author: raw.yazar,
      date: raw.zaman,
      url: raw.link,
      thumbnail: this.toImageUrl(raw.resim)
    };
  }

  static mapNewsList(rawList: any[]): NewsResponse[] {
    return (rawList || []).map(item => this.mapNews(item));
  }
}
