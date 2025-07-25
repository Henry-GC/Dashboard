"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";
import axios from "@/lib/axios-config";
import { Build, BuildComponent } from "./types";
import { Product } from "../productos/types";
import { BuildModal } from "./BuildModal";
import { EditBuildModal } from "./EditBuildModal";
import Image from "next/image";

export function EnsamblesTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBuild, setEditBuild] = useState<Build | null>(null);

  // Helper for category name
  const CATEGORY_MAP: Record<number, string> = {
    1: "PROCESADOR",
    2: "PLACA MADRE",
    3: "TARJETA GRAFICA",
    4: "MEMORIA RAM",
    5: "ALMACENAMIENTO",
    6: "FUENTE DE PODER",
    7: "CARCASA",
    8: "ACCESORIOS",
    9: "LAPTOPS"
  };

  // Fetch products and builds on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, buildsResponse] = await Promise.all([
          axios.get('/adm/products'),
          axios.get('/adm/builds')
        ]);
        
        setProducts(productsResponse.data || []);
        setBuilds(buildsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshBuilds = async () => {
    try {
      const response = await axios.get('/adm/builds');
      setBuilds(response.data || []);
    } catch (error) {
      console.error('Error refreshing builds:', error);
      toast.error('Error al actualizar los ensambles');
    }
  };

  const handleEdit = (id: string) => {
    const build = builds.find((b: Build) => b.id === id);
    if (build) {
      setEditBuild(build);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/adm/builds/delete/${id}`);
      setBuilds(builds.filter((b: Build) => b.id !== id));
      toast.success("Ensamble eliminado correctamente", {
        style: { background: '#22c55e', color: '#fff' },
      });
    } catch (err) {
      console.error("Error al eliminar ensamble:", err);
      toast.error("Error al eliminar el ensamble");
    }
  };

  const handleSaveEdit = (updatedBuild: Build) => {
    setBuilds(builds.map((b: Build) => b.id === updatedBuild.id ? updatedBuild : b));
  };

  const getComponentsList = (components: BuildComponent[]) => {
    return components.map((comp, index) => {
      const product = products.find((p: Product) => p.id === comp.product_id);
      const categoryName = product ? CATEGORY_MAP[product.category_id] : 'CATEGORIA DESCONOCIDA';
      return (
        <li key={index} className="text-sm">
          • <span className="font-medium text-blue-600">{categoryName}:</span> {product?.name || 'Producto desconocido'} <span className="text-muted-foreground">(x{comp.quantity})</span>
        </li>
      );
    });
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Cargando ensambles...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col mb-4">
        <div className="text-sm text-muted-foreground">Total de ensambles: <span className="font-semibold">{builds.length}</span></div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de ensambles</h2>
          <Button variant="default" onClick={() => setAddModalOpen(true)}>Agregar ensamble</Button>
        </div>
      </div>
      <Separator />
      <Accordion type="multiple" className="w-full mt-4">
        {builds.map((build: Build) => (
          <AccordionItem value={build.id} key={build.id}>
            <AccordionTrigger className="text-lg font-semibold flex justify-between items-center">
              <div>
                {build.name}
                <span className="text-xs text-muted-foreground ml-2">(${Number(build.price).toFixed(2)})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mb-2 text-sm text-muted-foreground">ID: {build.id}</div>
              <div className="mb-2">{build.description}</div>
              <div className="mb-2">
                <span className="font-semibold">Precio:</span> ${Number(build.price).toFixed(2)}
              </div>
              {build.img_url && (
                <div className="mb-2">
                  <Image 
                    src={build.img_url} 
                    alt={build.name} 
                    width={80} 
                    height={80} 
                    className="object-cover rounded" 
                  />
                </div>
              )}
              <div className="mb-2">
                <span className="font-semibold">Relevante:</span> {build.relevant ? "Sí" : "No"}
              </div>
              <div className="mb-2">
                <div className="font-semibold mb-1">Componentes:</div>
                {build.components && build.components.length > 0 ? (
                  <ul className="ml-2">
                    {getComponentsList(build.components)}
                  </ul>
                ) : (
                  <div className="text-muted-foreground text-sm ml-2">Sin componentes</div>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(build.id)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(build.id)}>Eliminar</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {builds.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No hay ensambles registrados. Haga clic en {"Agregar ensamble"} para comenzar.
        </div>
      )}

      <BuildModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={refreshBuilds}
        products={products}
      />

      <EditBuildModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditBuild(null);
        }}
        build={editBuild}
        onSave={handleSaveEdit}
        products={products}
      />
    </Card>
  );
}
