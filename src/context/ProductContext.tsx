"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/app/dashboard/productos/types";
import axios from "@/lib/axios-config";

interface ProductContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProductContext() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProductContext must be used within a ProductProvider");
  return ctx;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from API usando Axios
  const refreshProducts = async () => {
    try {
      const res = await axios.get("/adm/products");
      setProducts(res.data || []);
      
    } catch (error) {
      // Puedes manejar el error aquí si lo deseas
        console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
