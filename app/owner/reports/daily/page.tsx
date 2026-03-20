"use client";

import { useState, useEffect } from "react";
import { useDailyReport } from "@/hooks/use-reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  RefreshCw,
} from "lucide-react";

export default function DailyReportPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { report, loading, error, fetchReport } = useDailyReport(date);

  useEffect(() => {
    fetchReport();
  }, [date, fetchReport]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-5 w-5" />;
      case "transfer":
        return <CreditCard className="h-5 w-5" />;
      case "qris":
        return <QrCode className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Laporan Harian</h1>
        <div className="flex gap-2">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-auto"
          />
          <Button variant="outline" onClick={() => fetchReport()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : report ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Total Pendapatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(report.summary.total_income)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Total Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {report.summary.total_transactions}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Berdasarkan Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["cash", "transfer", "qris"].map((method) => {
                  const data = report.by_method[method];
                  return (
                    <div
                      key={method}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div className="p-3 rounded-full bg-muted">
                        {getMethodIcon(method)}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {method}
                        </p>
                        <p className="text-xl font-bold">
                          {formatCurrency(data?.total || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {data?.count || 0} transaksi
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Berdasarkan Sumber</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Work Order</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(report.by_source["work_order"]?.total || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {report.by_source["work_order"]?.count || 0} transaksi
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Penjualan Sparepart
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(report.by_source["sale"]?.total || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {report.by_source["sale"]?.count || 0} transaksi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          Tidak ada data untuk tanggal ini
        </div>
      )}
    </div>
  );
}
