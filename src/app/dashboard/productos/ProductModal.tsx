"use client";
import { useState, ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Product } from "./types";
import { SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const CATEGORIES = [
  { id: 1, code: "CPU", name: "PROCESADOR" },
  { id: 2, code: "MBO", name: "PLACA MADRE" },
  { id: 3, code: "GPU", name: "TARJETA GRAFICA" },
  { id: 4, code: "RAM", name: "MEMORIA RAM" },
  { id: 5, code: "STG", name: "ALMACENAMIENTO" },
  { id: 6, code: "PSU", name: "FUENTE DE PODER" },
  { id: 7, code: "CASE", name: "CARCASA" },
  { id: 8, code: "ACC", name: "ACCESORIOS" },
  { id: 9, code: "BLD", name: "ENSAMBLE" },
];

function getCategoryName(id: number) {
  return CATEGORIES.find(c => c.id === id)?.name || "";
}

export function ProductModal({ open, onClose, onAdd, onBulkAdd }: {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, "id">) => void;
  onBulkAdd: (products: Product[]) => void;
  refreshProducts: () => Promise<void>;
}) {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      img_url: "",
      relevant: false,
      stock: "",
      category_id: 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Campo obligatorio"),
      price: Yup.number().required("Campo obligatorio"),
      stock: Yup.number().required("Campo obligatorio"),
    }),
    onSubmit: (values, { resetForm }) => {
      // Solo agrega a la lista local, no envía al backend
      const newProduct = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        image: values.img_url,
        category: getCategoryName(Number(values.category_id)),
      };
      onAdd(newProduct);
      resetForm();
    },
  });
  const [excelProducts, setExcelProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<"manual" | "excel">("manual");
  const [dragActive, setDragActive] = useState(false);

  // Para compatibilidad con drag & drop y file input
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    formik.handleChange(e);
  };

  // Handle file upload or drag & drop
  const handleImageFile = (file: File) => {
    // Simulate upload and get a URL (replace with real upload logic)
    const url = URL.createObjectURL(file);
    formik.setFieldValue("img_url", url);
  };
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // handleSubmit ahora lo maneja formik

  // Excel upload handler (mock, real parsing should use xlsx or similar)
  const handleExcel = () => {
    // Here you would parse the file and extract products
    // For now, just mock a couple of products
    setExcelProducts([
      {
        id: Math.random().toString(36).slice(2),
        name: "Producto Excel 1",
        description: "Desc Excel 1",
        price: 100,
        img_url: "",
        relevant: false,
        stock: 5,
        category_id: 1,
        category: getCategoryName(1)
      },
      {
        id: Math.random().toString(36).slice(2),
        name: "Producto Excel 2",
        description: "Desc Excel 2",
        price: 200,
        img_url: "",
        relevant: true,
        stock: 10,
        category_id: 2,
        category: getCategoryName(2)
      }
    ]);
  };

  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Agregar productos</h2>
          <div className="flex gap-2 mb-4">
            <Button variant={tab === "manual" ? "default" : "outline"} onClick={() => setTab("manual")}>Manual</Button>
            <Button variant={tab === "excel" ? "default" : "outline"} onClick={() => setTab("excel")}>Excel</Button>
          </div>
          {tab === "manual" ? (
            <form onSubmit={formik.handleSubmit} className="space-y-3" autoComplete="off">
              <div>
                <Label>Nombre</Label>
                <Input name="name" value={formik.values.name} onChange={handleChange} required />
              </div>
              <div>
                <Label>Descripción</Label>
                <textarea name="description" value={formik.values.description} onChange={handleChange} rows={2} className="w-full border rounded px-2 py-1 resize-none" />
              </div>
              <div>
                <Label>Precio</Label>
                <Input name="price" type="number" value={formik.values.price} onChange={handleChange} required />
              </div>
              <div>
                <Label>Imagen</Label>
                <div className="flex flex-col gap-2">
                <Input name="img_url" value={formik.values.img_url} onChange={handleChange} placeholder="Pega el enlace de la imagen" />
                  <div
                    className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${dragActive ? "border-blue-500 bg-blue-50" : "border-muted"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="mb-2">Arrastra y suelta una imagen aquí o</div>
                    <Input type="file" accept="image/*" onChange={handleFileInput} className="w-full" />
                  </div>
                  {formik.values.img_url && (
                    <Image 
                      src={formik.values.img_url} 
                      alt="preview" 
                      width={96} 
                      height={96} 
                      className="object-cover rounded mx-auto mt-2" 
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="relevant" checked={formik.values.relevant} onChange={handleChange} />
                <Label>Relevante</Label>
              </div>
              <div>
                <Label>Stock</Label>
                <Input name="stock" type="number" value={formik.values.stock} onChange={handleChange} required />
              </div>
              <div>
                <Label>Categoría</Label>
                <select name="category_id" value={formik.values.category_id} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <SheetFooter>
                <Button type="submit" className="w-full">Agregar a la lista</Button>
              </SheetFooter>
            </form>
          ) : (
            <div className="space-y-3">
              <Label>Subir archivo Excel</Label>
              <Input type="file" accept=".xlsx,.xls" onChange={handleExcel} />
              {excelProducts.length > 0 && (
                <>
                  <div className="text-sm text-muted-foreground">{excelProducts.length} productos listos para agregar</div>
                  <Button onClick={() => { onBulkAdd(excelProducts); setExcelProducts([]); }} className="w-full">Agregar productos de Excel</Button>
                </>
              )}
            </div>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    )
  );
}
