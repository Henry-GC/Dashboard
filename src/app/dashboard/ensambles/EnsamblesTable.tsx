"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";
import axios from "@/lib/axios-config";
import { useProductContext } from "@/context/ProductContext";
import { useBuildContext } from "@/context/BuildContext";
import { Build } from "./types";
import { BuildModal } from "./BuildModal";
import { EditBuildModal } from "./EditBuildModal";

export function EnsamblesTable() {
  const { products } = useProductContext();
  const { builds, setBuilds, refreshBuilds } = useBuildContext();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBuild, setEditBuild] = useState<Build | null>(null);

  const handleEdit = (id: string) => {
    const build = builds.find(b => b.id === id);
    if (build) {
      setEditBuild(build);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/adm/builds/delete/${id}`);
      setBuilds(builds.filter(b => b.id !== id));
      toast.success("Ensamble eliminado correctamente", {
        style: { background: '#22c55e', color: '#fff' },
      });
    } catch (err) {
      console.error("Error al eliminar ensamble:", err);
      toast.error("Error al eliminar el ensamble");
    }
  };

  const handleSaveEdit = (updatedBuild: Build) => {
    setBuilds(builds.map(b => b.id === updatedBuild.id ? updatedBuild : b));
  };

  const getComponentsList = (components: any[]) => {
    return components.map((comp, index) => {
      const product = products.find(p => p.id === comp.product_id);
      return (
        <li key={index} className="text-sm">
          • {product?.name || 'Producto desconocido'} <span className="text-muted-foreground">(x{comp.quantity})</span>
        </li>
      );
    });
  };

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
        {builds.map(build => (
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
                  <img src={build.img_url} alt={build.name} className="w-20 h-20 object-cover rounded" />
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
          No hay ensambles registrados. Haga clic en "Agregar ensamble" para comenzar.
        </div>
      )}

      <BuildModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={() => {}} // Not used since we refresh from context
      />

      <EditBuildModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditBuild(null);
        }}
        build={editBuild}
        onSave={handleSaveEdit}
      />
    </Card>
  );
}
