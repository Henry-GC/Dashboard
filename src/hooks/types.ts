export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  relevant: boolean;
  category_id: number;
  category?: string;
};
export type ProductForm = {
  name: string;
  description: string;
  price: string;
  img_url: string;
  relevant: boolean;
  stock: string;
  category_id: number;
};