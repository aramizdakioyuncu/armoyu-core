/**
 * Global base response structure for all ARMOYU API responses.
 * Standardizes the envelope for single objects and lists.
 */
export interface BaseResponse<T> {
  /** The actual data payload */
  icerik?: T;
  /** Success status (1 for success, 0 for error) */
  durum: number;
  /** Response message or error description */
  aciklama: string;
  /** Optional detailed status/error code */
  aciklamadetay?: number;
  /** Response timestamp */
  zaman?: string;
}
