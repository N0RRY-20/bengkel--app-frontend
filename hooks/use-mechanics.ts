"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { Mechanic } from "@/types/master-data";

export function useMechanics() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMechanics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<{ data: Mechanic[] }>("/api/mechanics");
      if (response.ok) {
        setMechanics(response.data?.data || []);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch mechanics";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMechanics();
  }, [fetchMechanics]);

  return { mechanics, loading, error, refetch: fetchMechanics };
}

export async function createMechanic(data: {
  user_id: number;
  persentase_jasa: number;
}) {
  return apiPost("/api/mechanics", data as unknown as Record<string, unknown>);
}

export async function updateMechanic(
  id: number,
  data: { persentase_jasa: number }
) {
  return apiPut(`/api/mechanics/${id}`, data as unknown as Record<string, unknown>);
}

export interface MechanicEarnings {
  mechanic_id: number;
  mechanic_name: string;
  persentase: number;
  period: string;
  total_work_orders: number;
  total_jasa: number;
  pendapatan: number;
}

export async function getMechanicEarnings(
  id: number,
  month?: number,
  year?: number
) {
  let url = `/api/mechanics/${id}/earnings`;
  if (month && year) {
    url += `?month=${month}&year=${year}`;
  }
  return apiGet<MechanicEarnings>(url);
}
