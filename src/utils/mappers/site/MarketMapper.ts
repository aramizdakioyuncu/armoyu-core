import { MarketCurrencyResponse } from '../../../models';

export class MarketMapper {
  static mapCurrency(item: any): MarketCurrencyResponse {
    return {
      id: Number(item['#']) || 0,
      logo: item.dovizlink || '',
      code: item.dovizkisaisim || '',
      value: item.dovizdeger || '0'
    };
  }

  static mapCurrencyList(items: any[]): MarketCurrencyResponse[] {
    if (!Array.isArray(items)) return [];
    return items.map(item => this.mapCurrency(item));
  }
}
