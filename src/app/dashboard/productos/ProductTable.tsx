"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "@/lib/axios-config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Product } from "./types";
import { ProductModal } from "./ProductModal";
import { EditProductModal } from "./EditProductModal";
import Image from "next/image";

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/adm/products');
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    try {
      const response = await axios.get('/adm/products');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast.error('Error al actualizar los productos');
    }
  };

  // Placeholder handlers
  const handleEdit = (id: string) => {
    const prod = products.find((p: Product) => p.id === id);
    if (prod) {
      setEditProduct(prod);
      setEditModalOpen(true);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/adm/products/delete/${id}`);
      setProducts(products.filter((p: Product) => p.id !== id));
    } catch (err) {
      alert("Error al eliminar el producto");
      console.error("Error al eliminar el producto:", err);
    }
  };

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).slice(2) // Temporary ID for pending products
    };
    setPendingProducts(prev => [...prev, newProduct]);
  };
  const handleBulkAdd = (bulk: Product[]) => {
    setPendingProducts(prev => [...prev, ...bulk]);
  };
  const handleUpload = () => {
    setShowConfirm(true);
  };
  const handleConfirmUpload = async () => {
    try {
      await axios.post("/adm/products/create", pendingProducts);
      setPendingProducts([]);
      setShowConfirm(false);
      setModalOpen(false);
      await refreshProducts();
      toast.success("Productos agregados correctamente", {
        style: { background: '#22c55e', color: '#fff' },
      });
    } catch (err) {
      alert("Error al agregar productos");
      console.error("Error al agregar productos:", err);
    }
  };

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

  // Agrupar productos por categoría
  const groupedProducts: Record<number, Product[]> = {};
  products.forEach((product) => {
    if (!groupedProducts[product.category_id]) groupedProducts[product.category_id] = [];
    groupedProducts[product.category_id].push(product);
  });

  const totalProductos = products.length;

  const handleSaveEdit = (updated: Product) => {
    // Aquí podrías actualizar el estado local si lo deseas
    setProducts(products.map((p: Product) => p.id === updated.id ? updated : p));
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Cargando productos...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">Total de productos: <span className="font-semibold">{totalProductos}</span></div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de productos</h2>
          <div className="flex gap-2">
            <Button variant="default" onClick={() => setModalOpen(true)}>Agregar producto</Button>
            {pendingProducts.length > 0 && (
              <Button variant="secondary" onClick={handleUpload}>
                Subir ({pendingProducts.length})
              </Button>
            )}
          </div>
        </div>
      </div>
      <Separator />
      {pendingProducts.length > 0 && (
        <div className="mb-4">
          <div className="font-semibold mb-2">Productos por subir:</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-1 text-left">Nombre</th>
                  <th className="px-2 py-1 text-left">Descripción</th>
                  <th className="px-2 py-1 text-left">Precio</th>
                  <th className="px-2 py-1 text-left">Imagen</th>
                  <th className="px-2 py-1 text-left">Relevante</th>
                  <th className="px-2 py-1 text-left">Stock</th>
                  <th className="px-2 py-1 text-left">Categoría</th>
                </tr>
              </thead>
              <tbody>
                {pendingProducts.map((p,index) => (
                  <tr key={index} className="border-b">
                    <td className="px-2 py-1">{p.name}</td>
                    <td className="px-2 py-1">{p.description}</td>
                    <td className="px-2 py-1">${p.price}</td>
                    <td className="px-2 py-1">
                      {p.img_url ? (
                        <Image 
                          src={p.img_url} 
                          alt={p.name} 
                          width={32} 
                          height={32} 
                          className="object-cover rounded" 
                        />
                      ) : (
                        <span className="text-muted-foreground">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-2 py-1">{p.relevant ? "Sí" : "No"}</td>
                    <td className="px-2 py-1">{p.stock}</td>
                    <td className="px-2 py-1">{CATEGORY_MAP[p.category_id] || p.category_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Productos agrupados por categoría con acordeón */}
      <Accordion type="multiple" className="w-full">
        {Object.entries(CATEGORY_MAP).map(([catId, catName]) => (
          <AccordionItem value={catId} key={catId}>
            <AccordionTrigger className="text-lg font-semibold flex justify-between items-center">
              <div>
                {catName}
                <span className="text-xs text-muted-foreground ml-2">({groupedProducts[Number(catId)]?.length || 0})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-2 py-2 text-left">Nombre</th>
                      <th className="px-2 py-2 text-left">Descripción</th>
                      <th className="px-2 py-2 text-left">Precio</th>
                      <th className="px-2 py-2 text-left">Imagen</th>
                      <th className="px-2 py-2 text-left">Relevante</th>
                      <th className="px-2 py-2 text-left">Stock</th>
                      <th className="px-2 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedProducts[Number(catId)]?.length ? (
                      groupedProducts[Number(catId)].map(product => (
                        <tr key={product.id} className="border-b hover:bg-muted/50">
                          <td className="px-2 py-2 font-medium">{product.name}</td>
                          <td className="px-2 py-2">{product.description}</td>
                          <td className="px-2 py-2">${Number(product.price).toFixed(2)}</td>
                          <td className="px-2 py-2">
                            {product.img_url ? (
                              <Image 
                                src={product.img_url} 
                                alt={product.name} 
                                width={40} 
                                height={40} 
                                className="object-contain object-center rounded" 
                              />
                            ) : (
                              <span className="text-muted-foreground">Sin imagen</span>
                            )}
                          </td>
                          <td className="px-2 py-2">{product.relevant ? "Sí" : "No"}</td>
                          <td className="px-2 py-2">{product.stock}</td>
                          <td className="px-2 py-2 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(product.id)}>Editar</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={7} className="text-center text-muted-foreground py-4">Sin productos en esta categoría</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddProduct}
        onBulkAdd={handleBulkAdd}
        refreshProducts={refreshProducts}
      />
      <EditProductModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={editProduct}
        onSave={handleSaveEdit}
        refreshProducts={refreshProducts}
      />
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-xl w-full max-w-md">
            <div className="mb-4 text-lg font-semibold">¿Confirmar subida de productos?</div>
            <div className="mb-4 text-sm text-muted-foreground">Se enviarán {pendingProducts.length} productos al backend.</div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
              <Button variant="default" onClick={handleConfirmUpload}>Confirmar</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
