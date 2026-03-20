"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api";
import { User, RolesSummary } from "@/types/user";

export function useUsers(filters?: { role?: string; is_active?: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/api/users";
      const params = new URLSearchParams();
      if (filters?.role) params.append("role", filters.role);
      if (filters?.is_active !== undefined) {
        params.append("is_active", filters.is_active.toString());
      }
      if (params.toString()) url += `?${params.toString()}`;

      const response = await apiGet<{ data: User[] }>(url);
      if (response.ok) {
        setUsers(response.data?.data || []);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters?.role, filters?.is_active]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

export function useRolesSummary() {
  const [summary, setSummary] = useState<RolesSummary>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await apiGet<RolesSummary>("/api/users/roles-summary");
        if (response.ok && response.data) {
          setSummary(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch roles summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return { summary, loading };
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  persentase_jasa?: number;
}) {
  return apiPost("/api/users", data as unknown as Record<string, unknown>);
}

export async function updateUser(
  id: number,
  data: Partial<User & { password?: string; persentase_jasa?: number }>
) {
  return apiPut(`/api/users/${id}`, data as unknown as Record<string, unknown>);
}

export async function toggleUserActive(id: number) {
  return apiPatch(`/api/users/${id}/toggle-active`, {});
}

export async function deleteUser(id: number) {
  return apiDelete(`/api/users/${id}`);
}
