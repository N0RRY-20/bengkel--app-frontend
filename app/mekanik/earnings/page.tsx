"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wallet, TrendingUp } from "lucide-react";

interface DashboardData {
  estimated_earning: number;
  persentase_jasa: number;
  monthly_stats: {
    total_wo: number;
    completed: number;
  };
}

export default function EarningsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await apiGet<DashboardData>("/api/dashboard/mekanik");
      if (response.ok && response.data) {
        setData(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-muted-foreground" />
        <h1 className="text-3xl font-bold">Pendapatan Saya</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Estimasi Pendapatan Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(data?.estimated_earning || 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Persentase jasa: {((data?.persentase_jasa || 0) * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Work Order Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data?.monthly_stats?.completed || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              dari {data?.monthly_stats?.total_wo || 0} total WO
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cara Perhitungan</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Pendapatan Anda dihitung dari total jasa yang dikerjakan dikalikan
            dengan persentase yang telah disepakati.
          </p>
          <p className="mt-2">
            <strong>Rumus:</strong> Total Jasa × Persentase = Pendapatan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
