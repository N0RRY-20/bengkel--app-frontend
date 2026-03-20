"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wrench } from "lucide-react";

interface WorkOrder {
  id: number;
  plat_nomor: string;
  nama_pemilik: string;
  status: string;
  services_count: number;
  parts_count: number;
  created_at: string;
}

interface DashboardData {
  active_work_orders: WorkOrder[];
}

export default function MyWorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await apiGet<DashboardData>("/api/dashboard/mekanik");
      if (response.ok && response.data) {
        setWorkOrders(response.data.active_work_orders || []);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dikerjakan":
        return <Badge variant="secondary">Dikerjakan</Badge>;
      case "selesai":
        return <Badge className="bg-yellow-500">Selesai</Badge>;
      case "dibayar":
        return <Badge className="bg-green-500">Dibayar</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="h-8 w-8 text-muted-foreground" />
        <h1 className="text-3xl font-bold">Pekerjaan Saya</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : workOrders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Tidak ada pekerjaan aktif saat ini
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workOrders.map((wo) => (
            <Card key={wo.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{wo.plat_nomor}</h3>
                    <p className="text-muted-foreground">{wo.nama_pemilik}</p>
                    <p className="text-sm mt-2">
                      {wo.services_count || 0} jasa • {wo.parts_count || 0} part
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(wo.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(wo.status)}
                    <p className="text-xs text-muted-foreground mt-2">
                      #{wo.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
