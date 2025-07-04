"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "./types";

const statusColor: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  pagada: "bg-green-100 text-green-800",
  enviada: "bg-blue-100 text-blue-800",
  cancelada: "bg-red-100 text-red-800",
};

const orders: Order[] = [
  {
    id: "ORD-001",
    cliente: "Juan Pérez",
    total: 1200.50,
    fecha: "2025-07-01",
    estado: "pendiente"
  },
  {
    id: "ORD-002",
    cliente: "Ana López",
    total: 850.00,
    fecha: "2025-07-01",
    estado: "pagada"
  },
  {
    id: "ORD-003",
    cliente: "Carlos Ruiz",
    total: 450.75,
    fecha: "2025-06-30",
    estado: "enviada"
  },
  {
    id: "ORD-004",
    cliente: "María Gómez",
    total: 999.99,
    fecha: "2025-06-29",
    estado: "cancelada"
  }
];

export function OrdersTable() {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Órdenes recientes</h2>
      </div>
      <Separator className="mb-4" />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left">ID</th>
              <th className="px-2 py-2 text-left">Cliente</th>
              <th className="px-2 py-2 text-left">Fecha</th>
              <th className="px-2 py-2 text-left">Total</th>
              <th className="px-2 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-muted/50">
                <td className="px-2 py-2 font-medium">{order.id}</td>
                <td className="px-2 py-2">{order.cliente}</td>
                <td className="px-2 py-2">{order.fecha}</td>
                <td className="px-2 py-2">${order.total.toFixed(2)}</td>
                <td className="px-2 py-2">
                  <Badge className={statusColor[order.estado] || ""}>
                    {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
