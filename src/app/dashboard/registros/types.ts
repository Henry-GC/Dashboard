export type RegistroMetricas = {
  ordenesPorMes: number[];
  visitas: number;
  nuevosUsuarios: number;
  usuariosTotales: number;
  topProductos: { nombre: string; ventas: number }[];
  notificaciones: { id: string; mensaje: string; fecha: string }[];
  usuarios: { id: string; nombre: string; email: string; fechaRegistro: string }[];
};
