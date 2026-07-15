"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Cpu,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Trophy,
  PackageSearch,
  RefreshCw,
  Eye,
} from "lucide-react";
import type {
  KpiData,
  TopProducto,
  TopEnsamble,
  ProductoStockBajo,
} from "./types";

// ─── Mock data (replace with API calls) ──────────────────────────
const kpiData: KpiData = {
  ventasDelMes: 847500,
  ventasMesPrevio: 720000,
  totalEnsambles: 34,
  productosStockCritico: 7,
  ordenesPendientes: 12,
};

const topProductos: TopProducto[] = [
  { id: "p1", nombre: "RTX 4070 Super", categoria: "GPU", ventas: 48, ingresos: 38400 },
  { id: "p2", nombre: "Ryzen 7 7800X3D", categoria: "CPU", ventas: 42, ingresos: 18900 },
  { id: "p3", nombre: "Kingston Fury 32GB", categoria: "RAM", ventas: 37, ingresos: 5550 },
  { id: "p4", nombre: "Samsung 990 Pro 2TB", categoria: "SSD", ventas: 31, ingresos: 6200 },
  { id: "p5", nombre: "Corsair RM850x", categoria: "PSU", ventas: 28, ingresos: 4200 },
];

const topEnsambles: TopEnsamble[] = [
  { id: "e1", nombre: "PC Gamer Pro", componentes: 8, ventas: 15, ingresos: 22500 },
  { id: "e2", nombre: "Workstation 3D", componentes: 9, ventas: 11, ingresos: 33000 },
  { id: "e3", nombre: "PC Streaming Plus", componentes: 7, ventas: 9, ingresos: 13500 },
  { id: "e4", nombre: "PC Oficina Ultra", componentes: 6, ventas: 8, ingresos: 4800 },
  { id: "e5", nombre: "Mini ITX Gaming", componentes: 7, ventas: 6, ingresos: 10200 },
];

const productosStockBajo: ProductoStockBajo[] = [
  { id: "s1", nombre: "RTX 4070 Super", categoria: "GPU", stockActual: 2, stockMinimo: 10, precio: 800 },
  { id: "s2", nombre: "Ryzen 9 7950X", categoria: "CPU", stockActual: 1, stockMinimo: 5, precio: 699 },
  { id: "s3", nombre: "Corsair Vengeance 64GB", categoria: "RAM", stockActual: 3, stockMinimo: 8, precio: 250 },
  { id: "s4", nombre: "ASUS ROG Strix B650-E", categoria: "Motherboard", stockActual: 0, stockMinimo: 5, precio: 320 },
  { id: "s5", nombre: "Noctua NH-D15S", categoria: "Cooler", stockActual: 4, stockMinimo: 10, precio: 110 },
  { id: "s6", nombre: "Lian Li O11 Dynamic", categoria: "Case", stockActual: 1, stockMinimo: 6, precio: 170 },
  { id: "s7", nombre: "Samsung 990 Pro 4TB", categoria: "SSD", stockActual: 2, stockMinimo: 5, precio: 350 },
];

// ─── Helpers ─────────────────────────────────────────────────────
function formatCurrency(value: number): string {
  return value.toLocaleString("es-HN", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function getStockLevel(actual: number, minimo: number) {
  if (actual === 0) return { label: "Agotado", variant: "destructive" as const };
  if (actual <= minimo * 0.3) return { label: "Crítico", variant: "destructive" as const };
  return { label: "Bajo", variant: "outline" as const };
}

// ─── Component ───────────────────────────────────────────────────
export function RegistrosDashboard() {
  const ventasDiff = kpiData.ventasDelMes - kpiData.ventasMesPrevio;
  const ventasPct = ((ventasDiff / kpiData.ventasMesPrevio) * 100).toFixed(1);
  const isPositive = ventasDiff >= 0;

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Ventas del Mes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Ventas del Mes
            </CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(kpiData.ventasDelMes)}
            </div>
            <p className={`text-xs flex items-center gap-1 mt-1 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
              {isPositive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {isPositive ? "+" : ""}{ventasPct}% vs. mes anterior
            </p>
          </CardContent>
        </Card>

        {/* Total de Ensambles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total de Ensambles
            </CardDescription>
            <Cpu className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalEnsambles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Configuraciones activas
            </p>
          </CardContent>
        </Card>

        {/* Stock Crítico – alert style */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-destructive">
              Stock Crítico
            </CardDescription>
            <AlertTriangle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {kpiData.productosStockCritico}
            </div>
            <p className="text-xs text-destructive/80 mt-1">
              Productos requieren reabastecimiento
            </p>
          </CardContent>
        </Card>

        {/* Ordenes Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Órdenes Pendientes
            </CardDescription>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.ordenesPendientes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren procesamiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Top Performers ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Productos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-amber-500" />
              <CardTitle>Top 5 Productos</CardTitle>
            </div>
            <CardDescription>
              Productos más vendidos del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProductos.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{p.ventas}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(p.ingresos)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top 5 Ensambles */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-amber-500" />
              <CardTitle>Top 5 Ensambles</CardTitle>
            </div>
            <CardDescription>
              Ensambles más vendidos del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Ensamble</TableHead>
                  <TableHead className="text-right">Componentes</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topEnsambles.map((e, i) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell className="text-right">{e.componentes}</TableCell>
                    <TableCell className="text-right">{e.ventas}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(e.ingresos)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Inventory Alerts ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PackageSearch className="size-5 text-destructive" />
            <CardTitle>Alertas de Inventario</CardTitle>
          </div>
          <CardDescription>
            Productos con stock por debajo del mínimo requerido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-center">Stock Actual</TableHead>
                <TableHead className="text-center">Stock Mínimo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productosStockBajo.map((p) => {
                const level = getStockLevel(p.stockActual, p.stockMinimo);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      <span
                        className={
                          p.stockActual === 0
                            ? "text-destructive font-bold"
                            : "text-amber-500 font-semibold"
                        }
                      >
                        {p.stockActual}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {p.stockMinimo}
                    </TableCell>
                    <TableCell>
                      <Badge variant={level.variant}>{level.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatCurrency(p.precio)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="size-3.5" />
                          <span className="hidden sm:inline">Reabastecer</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="size-3.5" />
                          <span className="hidden sm:inline">Ver Detalle</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
