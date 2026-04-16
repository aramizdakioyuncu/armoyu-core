/**
 * Standardized Response class for all ARMOYU Core services.
 * Wraps API responses to provide consistent success/error handling.
 */
export class ServiceResponse<T> {
  /** Success status (1 for success, 0 or other for error) */
  durum: number;
  /** Response message or error description */
  aciklama: string;
  /** The actual data payload */
  icerik: T | null;
  /** Optional detailed status/error code */
  kod?: number;

  constructor(durum: number, aciklama: string, icerik: T | null = null, kod?: number) {
    this.durum = durum;
    this.aciklama = aciklama;
    this.icerik = icerik;
    this.kod = kod;
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
  static error<T>(aciklama: string, kod: number = 0, icerik: T | null = null): ServiceResponse<T> {
    return new ServiceResponse<T>(0, aciklama, icerik, kod);
  }
}



