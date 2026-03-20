"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { ServiceMaster } from "@/types/master-data";

export function useServices(showAll: boolean = false) {
  const [services, setServices] = useState<ServiceMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const url = showAll ? "/api/services?all=1" : "/api/services";
      const response = await apiGet<{ data: ServiceMaster[] }>(url);
      if (response.ok) {
        setServices(response.data?.data || []);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch services";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [showAll]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}

export async function createService(data: { nama_jasa: string; harga: number }) {
  return apiPost("/api/services", data as unknown as Record<string, unknown>);
}

export async function updateService(id: number, data: Partial<ServiceMaster>) {
  return apiPut(`/api/services/${id}`, data as unknown as Record<string, unknown>);
}

export async function deleteService(id: number) {
  return apiDelete(`/api/services/${id}`);
}
