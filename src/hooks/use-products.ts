import * as React from "react";
import Axios from "@/lib/axios-config"

export default function useProducts() {
  const [productos, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await Axios.get("/api/productos");
        const data = response.data
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { productos, loading, error };
}