import { NotificationSettingsDTO } from '../../../models/dto/user/NotificationSettingsDTO';
import { NotificationSettings } from '../../../models/entities/user/NotificationSettings';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for User Notification Settings.
 * Converts API (0/1) values to application boolean flags.
 */
export class NotificationSettingsMapper extends BaseMapper {
  static mapSettings(raw: any): NotificationSettings {
    console.log("[NotificationSettingsMapper] INPUT RAW:", raw);
    
    // Eğer veri bir dizi içinde gelirse ilk elemanı al
    const data = Array.isArray(raw) ? raw[0] : raw;
    
    const dto: NotificationSettingsDTO = {
      paylasimbegeni: this.toNumber(data?.paylasimbegeni),
      paylasimyorum: this.toNumber(data?.paylasimyorum),
      yorumbegeni: this.toNumber(data?.yorumbegeni),
      dogumgunu: this.toNumber(data?.dogumgunu),
      etkinlik: this.toNumber(data?.etkinlik),
      yorumyanit: this.toNumber(data?.yorumyanit),
      mesajlar: this.toNumber(data?.mesajlar),
      aramalar: this.toNumber(data?.aramalar),
      bahsetmeler: this.toNumber(data?.bahsetmeler)
    };

    console.log("[NotificationSettingsMapper] MAPPED DTO:", dto);

    // Dashboard görselleştirmesi için direkt düz nesne (Literal Object) dönüyoruz
    return {
      postLike: dto.paylasimbegeni === 1,
      postComment: dto.paylasimyorum === 1,
      commentLike: dto.yorumbegeni === 1,
      birthday: dto.dogumgunu === 1,
      event: dto.etkinlik === 1,
      commentReply: dto.yorumyanit === 1,
      messages: dto.mesajlar === 1,
      calls: dto.aramalar === 1,
      mentions: dto.bahsetmeler === 1
    } as any;
  }
}
