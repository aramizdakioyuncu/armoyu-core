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

export interface ShopProductOwnerDTO {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface ShopProductDTO {
  id: number;
  name: string;
  description?: string;
  price: number;
  shipping?: number;
  url?: string;
  commentCount?: number;
  imageIds?: number[];
  category?: { id: number; name: string };
  shop?: { id: number; name: string; logo?: string };
  owner?: ShopProductOwnerDTO | null;
}

export interface CreateProductParams {
  name: string;
  price: number;
  url: string;
  description?: string;
  shipping?: number;
  categoryId?: number;
  imageIds?: number[];
  shopId?: number;
}

export interface ShopResponseDTO {
  id: number;
  name: string;
  description?: string;
  productCount?: number;
  logo?: string;
  products?: ShopProductDTO[];
}

export interface UpdateShopParams {
  name?: string;
  description?: string;
  logo?: string;
  logoSmall?: string;
  logoTiny?: string;
}
