"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RegistroMetricas } from "./types";

const data: RegistroMetricas = {
  ordenesPorMes: [12, 18, 25, 30, 22, 40, 35],
  visitas: 12000,
  nuevosUsuarios: 120,
  usuariosTotales: 1500,
  topProductos: [
    { nombre: "Camiseta básica", ventas: 120 },
    { nombre: "Pantalón slim fit", ventas: 90 },
    { nombre: "Zapatos deportivos", ventas: 80 },
  ],
  notificaciones: [
    { id: "1", mensaje: "Nuevo pedido recibido", fecha: "2025-07-02" },
    { id: "2", mensaje: "Usuario registrado: Ana López", fecha: "2025-07-01" },
  ],
  usuarios: [
    { id: "u1", nombre: "Juan Pérez", email: "juan@mail.com", fechaRegistro: "2025-06-30" },
    { id: "u2", nombre: "Ana López", email: "ana@mail.com", fechaRegistro: "2025-07-01" },
  ],
};

export function RegistrosDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 flex flex-col items-center">
        <span className="text-2xl font-bold">{data.ordenesPorMes.at(-1)}</span>
        <span className="text-muted-foreground">Órdenes este mes</span>
      </Card>
      <Card className="p-4 flex flex-col items-center">
        <span className="text-2xl font-bold">{data.visitas.toLocaleString("en-US")}</span>
        <span className="text-muted-foreground">Visitas web</span>
      </Card>
      <Card className="p-4 flex flex-col items-center">
        <span className="text-2xl font-bold">{data.nuevosUsuarios}</span>
        <span className="text-muted-foreground">Nuevos usuarios</span>
      </Card>
      <Card className="p-4 flex flex-col items-center">
        <span className="text-2xl font-bold">{data.usuariosTotales}</span>
        <span className="text-muted-foreground">Usuarios totales</span>
      </Card>
      <div className="md:col-span-2 xl:col-span-1">
        <Card className="p-4 h-full">
          <h3 className="font-semibold mb-2">Top productos favoritos</h3>
          <ul className="space-y-1">
            {data.topProductos.map((p) => (
              <li key={p.nombre} className="flex justify-between">
                <span>{p.nombre}</span>
                <Badge>{p.ventas} ventas</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="md:col-span-2 xl:col-span-1">
        <Card className="p-4 h-full">
          <h3 className="font-semibold mb-2">Notificaciones</h3>
          <ul className="space-y-1">
            {data.notificaciones.map((n) => (
              <li key={n.id} className="flex justify-between text-sm">
                <span>{n.mensaje}</span>
                <span className="text-muted-foreground">{n.fecha}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="md:col-span-2 xl:col-span-2">
        <Card className="p-4 h-full">
          <h3 className="font-semibold mb-2">Lista de usuarios</h3>
          <Separator className="mb-2" />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-1 text-left">Nombre</th>
                  <th className="px-2 py-1 text-left">Email</th>
                  <th className="px-2 py-1 text-left">Fecha de registro</th>
                </tr>
              </thead>
              <tbody>
                {data.usuarios.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="px-2 py-1">{u.nombre}</td>
                    <td className="px-2 py-1">{u.email}</td>
                    <td className="px-2 py-1">{u.fechaRegistro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
