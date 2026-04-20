import { ProductResponse } from './ProductResponse';

export interface OrderResponse {
  id?: string | number;
  items?: ProductResponse[];
  total?: number;
  status?: string;
  createdAt?: string;
  date?: string;
}
