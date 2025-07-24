export type BuildComponent = {
  product_id: string;
  quantity: number;
  product_name?: string; // Optional for display purposes
};

export type Build = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  img_url?: string;
  relevant: boolean;
  components: BuildComponent[];
  created_at?: string;
};

export type BuildFormData = {
  name: string;
  description: string;
  price: string;
  img_url: string;
  relevant: boolean;
  components: BuildComponent[];
};
