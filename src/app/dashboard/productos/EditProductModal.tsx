"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "@/lib/axios-config";
import { toast } from "sonner";
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

export function EditProductModal({ open, onClose, product, onSave, refreshProducts} : {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (p: Product) => void;
  refreshProducts: () => Promise<void>;
}) {
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      img_url: product?.img_url || "",
      relevant: product?.relevant || false,
      stock: product?.stock || "",
      category_id: product?.category_id || 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Campo obligatorio"),
      price: Yup.number().required("Campo obligatorio"),
      stock: Yup.number().required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      if (!product) return;
      try {
        await axios.put(`/adm/products/update/${product.id}`, values);
        onSave({
          ...product,
          ...values,
          price: Number(values.price),
          stock: Number(values.stock),
        });
        await refreshProducts();
        toast.success("Producto actualizado correctamente", {
          style: { background: '#22c55e', color: '#fff' },
        });
        onClose();
      } catch (err) {
        alert("Error al guardar el producto");
        console.error("Error al guardar el producto:", err);
      }
    }
  });

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Editar producto</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div>
            <Label>Nombre</Label>
            <Input name="name" value={formik.values.name} onChange={formik.handleChange} required />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input name="description" value={formik.values.description} onChange={formik.handleChange} />
          </div>
          <div>
            <Label>Precio</Label>
            <Input name="price" type="number" value={formik.values.price} onChange={formik.handleChange} required />
          </div>
          <div>
            <Label>Imagen URL</Label>
            <Input name="img_url" value={formik.values.img_url} onChange={formik.handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="relevant" checked={formik.values.relevant} onChange={formik.handleChange} />
            <Label>Relevante</Label>
          </div>
          <div>
            <Label>Stock</Label>
            <Input name="stock" type="number" value={formik.values.stock} onChange={formik.handleChange} required />
          </div>
          <div>
            <Label>Categoría</Label>
            <select name="category_id" value={formik.values.category_id} onChange={formik.handleChange} className="w-full border rounded px-2 py-1">
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Separator className="my-2" />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="default">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
