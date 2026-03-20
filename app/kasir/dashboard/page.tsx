"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FilePlus, ShoppingCart, ClipboardList, Wrench } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  pending_payment: Array<{
    id: number;
    plat_nomor: string;
    nama_pemilik: string;
    mekanik: string;
    total: number;
  }>;
  my_stats_today: {
    transactions: number;
    total_processed: number;
  };
  wo_in_progress: number;
}

export default function KasirDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiGet<DashboardData>("/api/dashboard/kasir");
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
      <h1 className="text-3xl font-bold">Dashboard Kasir</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/kasir/work-orders/create">
          <Card className="cursor-pointer hover:bg-accent transition-colors h-full">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <FilePlus className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-xl font-semibold">Buat Work Order Baru</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/kasir/pos">
          <Card className="cursor-pointer hover:bg-accent transition-colors h-full">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-xl font-semibold">POS Sparepart</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              WO Dikerjakan
            </CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.wo_in_progress || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transaksi Saya Hari Ini
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.my_stats_today.transactions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Diproses Hari Ini
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.my_stats_today.total_processed || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Work Order Menunggu Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.pending_payment?.length ? (
            <p className="text-muted-foreground">
              Tidak ada work order menunggu pembayaran.
            </p>
          ) : (
            <div className="space-y-3">
              {data.pending_payment.map((wo) => (
                <div
                  key={wo.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-semibold">{wo.plat_nomor}</p>
                    <p className="text-sm text-muted-foreground">
                      {wo.nama_pemilik} - Mekanik: {wo.mekanik}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(wo.total)}</p>
                    <Button size="sm" variant="default">
                      Bayar
                    </Button>
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
