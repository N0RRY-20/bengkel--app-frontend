"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api";
import { Product } from "@/types/master-data";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<{ data: Product[] }>("/api/products");
      if (response.ok) {
        setProducts(response.data?.data || []);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export async function createProduct(
  data: Omit<Product, "id" | "created_at" | "updated_at">
) {
  return apiPost("/api/products", data as unknown as Record<string, unknown>);
}

export async function updateProduct(id: number, data: Partial<Product>) {
  return apiPut(`/api/products/${id}`, data as unknown as Record<string, unknown>);
}

export async function updateProductStock(
  id: number,
  adjustment: number,
  reason: string
) {
  return apiPatch(`/api/products/${id}/stock`, { adjustment, reason });
}

export async function deleteProduct(id: number) {
  return apiDelete(`/api/products/${id}`);
}
