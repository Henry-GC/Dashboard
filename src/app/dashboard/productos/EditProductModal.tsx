"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Product } from "./types";

import React from "react";
const CATEGORIES = [
  { id: 1, name: "PROCESADOR" },
  { id: 2, name: "PLACA MADRE" },
  { id: 3, name: "TARJETA GRAFICA" },
  { id: 4, name: "MEMORIA RAM" },
  { id: 5, name: "ALMACENAMIENTO" },
  { id: 6, name: "FUENTE DE PODER" },
  { id: 7, name: "CARCASA" },
  { id: 8, name: "ACCESORIOS" },
  { id: 9, name: "ENSAMBLE" },
];

export function EditProductModal({ open, onClose, product, onSave } : {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (p: Product) => void;
}) {
  const [form, setForm] = useState<Product | null>(product);
  const [loading, setLoading] = useState(false);

  // Sync form with product prop
  React.useEffect(() => {
    setForm(product);
  }, [product]);

  if (!open || !form) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let val: string | number | boolean = value;

        if (type === "checkbox") {
            val = (e.target as HTMLInputElement).checked;
        } else if (type === "number") {
            val = Number(value);
        }

        setForm(f => f ? {
            ...f,
            [name]: val
        } : null);
    };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/productos/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Error al guardar");
      onSave(form!);
      onClose();
    } catch (err) {
      alert("Error al guardar el producto");
        console.error("Error al guardar el producto:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Editar producto</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Nombre</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input name="description" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <Label>Precio</Label>
            <Input name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <Label>Imagen URL</Label>
            <Input name="image" value={form.image} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="relevant" checked={form.relevant} onChange={handleChange} />
            <Label>Relevante</Label>
          </div>
          <div>
            <Label>Stock</Label>
            <Input name="stock" type="number" value={form.stock} onChange={handleChange} required />
          </div>
          <div>
            <Label>Categoría</Label>
            <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full border rounded px-2 py-1">
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Separator className="my-2" />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="default" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
