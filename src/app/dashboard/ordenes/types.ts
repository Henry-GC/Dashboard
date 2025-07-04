export type OrderStatus = "pendiente" | "pagada" | "enviada" | "cancelada";

export type Order = {
  id: string;
  cliente: string;
  total: number;
  fecha: string;
  estado: OrderStatus;
};
