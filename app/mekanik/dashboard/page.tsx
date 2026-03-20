"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wrench, Wallet, ClipboardList } from "lucide-react";

interface DashboardData {
  active_work_orders: Array<{
    id: number;
    plat_nomor: string;
    nama_pemilik: string;
    services_count: number;
    parts_count: number;
    created_at: string;
  }>;
  monthly_stats: {
    total_wo: number;
    completed: number;
  };
  estimated_earning: number;
  persentase_jasa: number;
}

export default function MekanikDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiGet<DashboardData>("/api/dashboard/mekanik");
        if (response.ok) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
      <div>
        <h1 className="text-3xl font-bold">Dashboard Mekanik</h1>
        <p className="text-muted-foreground mt-1">
          Anda hanya dapat melihat daftar pekerjaan yang ditugaskan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pekerjaan Aktif
            </CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.active_work_orders?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selesai Bulan Ini
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.monthly_stats.completed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              dari {data?.monthly_stats.total_wo || 0} total WO
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimasi Pendapatan
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.estimated_earning || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((data?.persentase_jasa || 0) * 100).toFixed(0)}% dari jasa
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Pekerjaan Aktif Saya
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.active_work_orders?.length ? (
            <p className="text-muted-foreground">
              Tidak ada pekerjaan saat ini.
            </p>
          ) : (
            <div className="space-y-3">
              {data.active_work_orders.map((wo) => (
                <div
                  key={wo.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-semibold">{wo.plat_nomor}</p>
                    <p className="text-sm text-muted-foreground">
                      {wo.nama_pemilik}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{wo.services_count} jasa, {wo.parts_count} part</p>
                    <p>{new Date(wo.created_at).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
