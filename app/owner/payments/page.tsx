"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard } from "lucide-react";

interface Payment {
  id: number;
  source_type: string;
  source_id: number;
  total: number;
  metode: string;
  kasir_id: number;
  created_at: string;
  kasir?: { name: string };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiGet<{ data: Payment[] }>(
        `/api/payments?date=${dateFilter}`
      );
      if (response.ok) {
        setPayments(response.data?.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Riwayat Pembayaran</h1>
        </div>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-auto"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada pembayaran untuk tanggal ini
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Kasir</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono">#{payment.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(payment.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {payment.source_type === "work_order" ? "WO" : "Sale"} #
                        {payment.source_id}
                      </Badge>
                    </TableCell>
                    <TableCell className="uppercase">
                      <Badge>{payment.metode}</Badge>
                    </TableCell>
                    <TableCell>{payment.kasir?.name || "-"}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(payment.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
