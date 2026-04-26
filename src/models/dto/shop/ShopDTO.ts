export interface ProductDTO {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image: string;
  category?: string;
  stock?: number;
  url?: string;
}

export interface OrderDTO {
  id: number;
  total: number;
  status: string;
  createdAt?: string;
  date?: string;
  items?: ProductDTO[];
}
