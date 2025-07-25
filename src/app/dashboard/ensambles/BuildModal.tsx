"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "@/lib/axios-config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BuildComponent } from "./types";
import { Product } from "../productos/types";

export function BuildModal({ 
  open, 
  onClose,
  onSave,
  products
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  products: Product[];
}) {
  const [components, setComponents] = useState<BuildComponent[]>([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      img_url: "",
      relevant: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Campo obligatorio"),
      description: Yup.string().required("Campo obligatorio"),
      price: Yup.number().required("Campo obligatorio"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (components.length === 0) {
        toast.error("Debe agregar al menos un componente");
        return;
      }

      try {
        const buildData = {
          ...values,
          price: Number(values.price),
          components
        };

        await axios.post("/adm/builds/createBuild", buildData);
        
        await onSave();
        toast.success("Ensamble agregado correctamente", {
          style: { background: '#22c55e', color: '#fff' },
        });
        
        resetForm();
        setComponents([]);
        onClose();
      } catch (err) {
        console.error("Error al agregar ensamble:", err);
        toast.error("Error al agregar el ensamble");
      }
    },
  });

  const addComponent = () => {
    setComponents([...components, { product_id: "", quantity: 1 }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: keyof BuildComponent, value: string | number) => {
    const updated = [...components];
    updated[index] = { ...updated[index], [field]: value };
    setComponents(updated);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Agregar ensamble</h2>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input 
              name="name" 
              value={formik.values.name} 
              onChange={formik.handleChange} 
              required 
            />
            {formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}
          </div>

          <div>
            <Label>Descripción</Label>
            <textarea 
              name="description" 
              value={formik.values.description} 
              onChange={formik.handleChange} 
              rows={3} 
              className="w-full border rounded px-3 py-2 resize-none" 
              required
            />
            {formik.errors.description && <div className="text-red-500 text-sm">{formik.errors.description}</div>}
          </div>

          <div>
            <Label>Precio</Label>
            <Input 
              name="price" 
              type="number" 
              value={formik.values.price} 
              onChange={formik.handleChange} 
              required 
            />
            {formik.errors.price && <div className="text-red-500 text-sm">{formik.errors.price}</div>}
          </div>

          <div>
            <Label>Imagen URL</Label>
            <Input 
              name="img_url" 
              value={formik.values.img_url} 
              onChange={formik.handleChange} 
              placeholder="URL de la imagen (opcional)" 
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="relevant" 
              checked={formik.values.relevant} 
              onChange={formik.handleChange} 
            />
            <Label>Relevante</Label>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-lg">Componentes</Label>
              <Button type="button" variant="outline" onClick={addComponent}>
                Agregar componente
              </Button>
            </div>

            {components.map((component, index) => (
              <div key={index} className="flex gap-2 mb-2 items-end">
                <div className="flex-1">
                  <Label>Producto</Label>
                  <select
                    value={component.product_id}
                    onChange={(e) => updateComponent(index, "product_id", e.target.value)}
                    className="w-full border rounded px-2 py-1"
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={component.quantity}
                    onChange={(e) => updateComponent(index, "quantity", parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeComponent(index)}
                >
                  Eliminar
                </Button>
              </div>
            ))}

            {components.length === 0 && (
              <div className="text-center text-muted-foreground py-4 border-2 border-dashed rounded">
                No hay componentes agregados. Haga clic en {"Agregar componente"} para comenzar.
              </div>
            )}
          </div>

          <Separator />

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="default">
              Agregar ensamble
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
