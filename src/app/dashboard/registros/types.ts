// Types for the Registros Operational Dashboard

export type KpiData = {
  ventasDelMes: number;
  ventasMesPrevio: number;
  totalEnsambles: number;
  productosStockCritico: number;
  ordenesPendientes: number;
};

export type TopProducto = {
  id: string;
  nombre: string;
  categoria: string;
  ventas: number;
  ingresos: number;
};

export type TopEnsamble = {
  id: string;
  nombre: string;
  componentes: number;
  ventas: number;
  ingresos: number;
};

export type ProductoStockBajo = {
  id: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  precio: number;
};
