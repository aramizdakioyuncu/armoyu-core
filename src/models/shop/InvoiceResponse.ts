export interface InvoiceItemDTO {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  date: string;
}

export interface InvoiceDTO {
  id: number;
  name: string;
  date: string;
  price: number;
  vat: number;
  total: number;
  status: number;
  paymentId: string;
  owner: {
    id: number;
    username: string;
    displayName: string;
    avatar: string;
  };
  items?: InvoiceItemDTO[];
}

export type InvoiceResponse = InvoiceDTO;
