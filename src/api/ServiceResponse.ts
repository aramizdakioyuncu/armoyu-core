import { BaseResponse } from '../models/core/BaseResponse';

/**
 * Standardized Response class for all ARMOYU Core services.
 * Wraps API responses to provide consistent success/error handling.
 */
export class ServiceResponse<T> implements BaseResponse<T> {
  /** Success status (1 for success, 0 or other for error) */
  durum: number;
  /** Response message or error description */
  aciklama: string;
  /** The actual data payload */
  icerik: T | undefined;
  /** Detailed status/error code */
  aciklamadetay?: number;
  /** Server timestamp */
  zaman?: string;

  constructor(durum: number, aciklama: string, icerik: T, aciklamadetay?: number, zaman?: string) {
    this.durum = durum;
    this.aciklama = aciklama;
    this.icerik = icerik;
    this.aciklamadetay = aciklamadetay;
    this.zaman = zaman;
  }

  /**
   * Helper to create a success response.
   */
  static success<T>(icerik: T, aciklama: string = 'İşlem Başarılı'): ServiceResponse<T> {
    return new ServiceResponse<T>(1, aciklama, icerik, 1);
  }

  /**
   * Helper to create an error response.
   */
  static error<T>(aciklama: string, aciklamadetay: number = 0, icerik: T = null as any): ServiceResponse<T> {
    return new ServiceResponse<T>(0, aciklama, icerik, aciklamadetay);
  }
}
