export type OrderStatus = "PENDIENTE" | "PAGO CONFIRMADO" | "ENVIADO" | "COMPLETADO" | "CANCELADO";

export type Order = {
  id: number;
  user_id: number;
  state: OrderStatus;
  total_price: string | number;
  time_order: string;
  username: string;
  email: string;
  nombres: string;
  celular: number;
  ci: number;
  direccion: string;
  referencia?: string;
  banco?: string;
  comprobante?: number;
};

export type OrderDetail = {
  id: number;
  product_id: number;
  count: number;
  price_unit: string | number;
  total: string | number;
  product_name: string;
  product_description?: string;
};
