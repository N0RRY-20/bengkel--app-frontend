"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import { WorkOrder, WorkOrderDetail } from "@/types/work-order";

export function useWorkOrders(status?: string) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkOrders = useCallback(async () => {
    try {
      setLoading(true);
      const url = status
        ? `/api/work-orders?status=${status}`
        : "/api/work-orders";
      const response = await apiGet<{ data: WorkOrder[] }>(url);
      if (response.ok) {
        setWorkOrders(response.data?.data || []);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch work orders";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  return { workOrders, loading, error, refetch: fetchWorkOrders };
}

export function useWorkOrder(id: number) {
  const [workOrder, setWorkOrder] = useState<WorkOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<{
        data: WorkOrder;
        total_jasa: number;
        total_parts: number;
        grand_total: number;
      }>(`/api/work-orders/${id}`);
      if (response.ok && response.data) {
        setWorkOrder({
          ...response.data.data,
          total_jasa: response.data.total_jasa,
          total_parts: response.data.total_parts,
          grand_total: response.data.grand_total,
        });
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch work order";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWorkOrder();
    }
  }, [id, fetchWorkOrder]);

  return { workOrder, loading, error, refetch: fetchWorkOrder };
}

export async function createWorkOrder(data: {
  nama_pemilik: string;
  plat_nomor: string;
  mechanic_id: number;
}) {
  return apiPost<{ data: WorkOrder }>("/api/work-orders", data);
}

export async function addServiceToWorkOrder(
  workOrderId: number,
  serviceMasterId: number
) {
  return apiPost(`/api/work-orders/${workOrderId}/services`, {
    service_master_id: serviceMasterId,
  });
}

export async function removeServiceFromWorkOrder(
  workOrderId: number,
  serviceId: number
) {
  return apiDelete(`/api/work-orders/${workOrderId}/services/${serviceId}`);
}

export async function addPartToWorkOrder(
  workOrderId: number,
  data: { product_id: number; qty: number; diskon?: number }
) {
  return apiPost(`/api/work-orders/${workOrderId}/parts`, data);
}

export async function removePartFromWorkOrder(
  workOrderId: number,
  partId: number
) {
  return apiDelete(`/api/work-orders/${workOrderId}/parts/${partId}`);
}

export async function finishWorkOrder(workOrderId: number) {
  return apiPatch(`/api/work-orders/${workOrderId}/finish`, {});
}

export async function payWorkOrder(
  workOrderId: number,
  metode: "cash" | "transfer" | "qris"
) {
  return apiPost(`/api/work-orders/${workOrderId}/pay`, { metode });
}
