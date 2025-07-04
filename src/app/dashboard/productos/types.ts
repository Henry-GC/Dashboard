export type Product = {
  id: string;
  name: string;
  price: number | string;
  stock: number;
  image?: string;
  description?: string;
  relevant: boolean;
  category_id: number;
  category?: string;
};
