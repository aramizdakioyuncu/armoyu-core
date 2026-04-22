import { ArmoyuLogger } from './Logger';

export enum HttpMethod { GET = 'GET', POST = 'POST', PUT = 'PUT', PATCH = 'PATCH', DELETE = 'DELETE' }

export interface ApiConfig {
  baseUrl: string;
  token?: string | null;
  apiKey?: string | null;
  headers?: Record<string, string>;
  logger?: ArmoyuLogger;
  usePreviousVersion?: boolean;
  debugMode?: boolean;
}

export interface StandardApi<T> {
  durum: number | string;
  icerik: T;
  aciklama: string;
  kod: number | string;
  aciklamadetay?: any;
}

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  method?: HttpMethod | string;
}
