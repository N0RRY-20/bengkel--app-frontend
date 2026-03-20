"use client";

import { useState, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api";
import {
  DailyReport,
  MonthlyReport,
  MechanicsReport,
  ActivityLog,
  Correction,
} from "@/types/report";

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

export function useDailyReport(date: string) {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<DailyReport>(
        `/api/reports/daily?date=${date}`
      );
      if (response.ok && response.data) {
        setReport(response.data);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch report";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [date]);

  return { report, loading, error, fetchReport };
}

export function useMonthlyReport(month: number, year: number) {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<MonthlyReport>(
        `/api/reports/monthly?month=${month}&year=${year}`
      );
      if (response.ok && response.data) {
        setReport(response.data);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch report";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  return { report, loading, error, fetchReport };
}

export function useMechanicsReport(month: number, year: number) {
  const [report, setReport] = useState<MechanicsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<MechanicsReport>(
        `/api/reports/mechanics?month=${month}&year=${year}`
      );
      if (response.ok && response.data) {
        setReport(response.data);
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch report";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  return { report, loading, error, fetchReport };
}

export function useActivityLogs(limit: number = 50) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  } | null>(null);

  const fetchLogs = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const response = await apiGet<PaginatedResponse<ActivityLog>>(
          `/api/reports/activity-logs?limit=${limit}&page=${page}`
        );
        if (response.ok && response.data) {
          setLogs(response.data.data || []);
          setPagination({
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            total: response.data.total,
          });
        }
        setError(null);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch activity logs";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  return { logs, loading, error, pagination, fetchLogs };
}

export function useCorrections() {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  } | null>(null);

  const fetchCorrections = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await apiGet<PaginatedResponse<Correction>>(
        `/api/corrections?page=${page}`
      );
      if (response.ok && response.data) {
        setCorrections(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
        });
      }
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch corrections";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { corrections, loading, error, pagination, fetchCorrections };
}

export async function createCorrection(data: {
  source_type: "work_order" | "sale";
  source_id: number;
  alasan: string;
  refund_amount?: number;
}) {
  return apiPost(
    "/api/corrections",
    data as unknown as Record<string, unknown>
  );
}
