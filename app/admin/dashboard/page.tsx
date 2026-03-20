"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wrench, Package, AlertTriangle, Users } from "lucide-react";

interface DashboardData {
  work_orders: {
    dikerjakan: number;
    selesai: number;
    total_hari_ini: number;
  };
  products: {
    total: number;
    low_stock: number;
    out_of_stock: number;
  };
  low_stock_products: Array<{
    id: number;
    nama: string;
    stok: number;
    harga_jual: number;
  }>;
  mechanics: Array<{
    id: number;
    nama: string;
    active_wo: number;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiGet<DashboardData>("/api/dashboard/admin");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              WO Dikerjakan
            </CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.work_orders.dikerjakan || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.work_orders.selesai || 0} menunggu bayar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              WO Hari Ini
            </CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.work_orders.total_hari_ini || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Produk
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.products.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.products.out_of_stock || 0} habis stok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stok Rendah
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.products.low_stock || 0}
            </div>
            <p className="text-xs text-muted-foreground">produk perlu restock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Produk Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data?.low_stock_products?.length ? (
              <p className="text-muted-foreground">Tidak ada produk stok rendah</p>
            ) : (
              <ul className="space-y-2">
                {data.low_stock_products.map((product) => (
                  <li
                    key={product.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                  >
                    <span>{product.nama}</span>
                    <span className="font-semibold text-red-500">
                      Sisa: {product.stok}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Status Mekanik
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data?.mechanics?.length ? (
              <p className="text-muted-foreground">Tidak ada mekanik aktif</p>
            ) : (
              <ul className="space-y-2">
                {data.mechanics.map((mechanic) => (
                  <li
                    key={mechanic.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                  >
                    <span>{mechanic.nama}</span>
                    <span className="font-semibold">
                      {mechanic.active_wo} WO aktif
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
