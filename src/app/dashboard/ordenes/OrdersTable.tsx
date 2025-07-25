"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "@/lib/axios-config";
import { Order, OrderStatus } from "./types";

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado options
  const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
    { value: "PENDIENTE", label: "Pendiente", color: "bg-yellow-500" },
    { value: "PAGO CONFIRMADO", label: "Pago Confirmado", color: "bg-blue-500" },
    { value: "ENVIADO", label: "Enviado", color: "bg-purple-500" },
    { value: "COMPLETADO", label: "Completado", color: "bg-green-500" },
    { value: "CANCELADO", label: "Cancelado", color: "bg-red-500" }
  ];

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/adm/orders');
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error al cargar las órdenes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await axios.put(`/adm/orders/update/${orderId}`, {
        state: newStatus
      });

      // Update local state
      setOrders(orders.map((order: Order) => 
        order.id === orderId ? { ...order, state: newStatus } : order
      ));

      toast.success("Estado de la orden actualizado correctamente", {
        style: { background: '#22c55e', color: '#fff' },
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado de la orden');
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await axios.delete(`/adm/orders/delete/${orderId}`);

      // Update local state - remove the deleted order
      setOrders(orders.filter((order: Order) => order.id !== orderId));

      toast.success("Orden eliminada correctamente", {
        style: { background: '#22c55e', color: '#fff' },
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Error al eliminar la orden');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = STATUS_OPTIONS.find(option => option.value === status);
    return (
      <Badge className={`${statusConfig?.color} text-white`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Cargando órdenes...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col mb-4">
        <div className="text-sm text-muted-foreground">
          Total de órdenes: <span className="font-semibold">{orders.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de órdenes</h2>
        </div>
      </div>
      <Separator />
      
      <Accordion type="multiple" className="w-full mt-4">
        {orders.map((order: Order) => (
          <AccordionItem value={order.id.toString()} key={order.id}>
            <AccordionTrigger className="text-lg font-semibold flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span>Orden #{order.id}</span>
                <span className="text-sm font-normal">{order.nombres}</span>
                <span className="text-sm text-muted-foreground">
                  ${Number(order.total_price).toFixed(2)}
                </span>
                {getStatusBadge(order.state)}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><span className="font-semibold">ID:</span> {order.id}</div>
                  <div><span className="font-semibold">Cliente:</span> {order.nombres}</div>
                  <div><span className="font-semibold">Email:</span> {order.email}</div>
                  <div><span className="font-semibold">Teléfono:</span> {order.celular}</div>
                  <div><span className="font-semibold">CI:</span> {order.ci}</div>
                  <div><span className="font-semibold">Fecha:</span> {formatDate(order.time_order)}</div>
                </div>
                
                <div className="space-y-2">
                  <div><span className="font-semibold">Dirección:</span> {order.direccion}</div>
                  {order.referencia && (
                    <div><span className="font-semibold">Referencia:</span> {order.referencia}</div>
                  )}
                  {order.banco && (
                    <div><span className="font-semibold">Banco:</span> {order.banco}</div>
                  )}
                  {order.comprobante && (
                    <div><span className="font-semibold">Comprobante:</span> {order.comprobante}</div>
                  )}
                  <div><span className="font-semibold">Total:</span> ${Number(order.total_price).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Estado:</span>
                    <Select
                      value={order.state}
                      onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Eliminar Orden
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {orders.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No hay órdenes registradas.
        </div>
      )}
    </Card>
  );
}
