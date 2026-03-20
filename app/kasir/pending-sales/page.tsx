"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Receipt } from "lucide-react";
import { toast } from "sonner";

interface SaleItem {
  id: number;
  nama_produk: string;
  harga: number;
  qty: number;
  diskon: number;
}

interface Sale {
  id: number;
  tipe_pembeli: string;
  total: number;
  status: string;
  created_at: string;
  items?: SaleItem[];
}

export default function PendingSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [processing, setProcessing] = useState(false);

  const fetchPendingSales = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiGet<{ data: Sale[] }>(
        "/api/sales?status=pending"
      );
      if (response.ok) {
        setSales(response.data?.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingSales();
  }, [fetchPendingSales]);

  const openPayDialog = (sale: Sale) => {
    setSelectedSale(sale);
    setPaymentMethod("cash");
    setPayDialogOpen(true);
  };

  const handlePay = async () => {
    if (!selectedSale) return;

    setProcessing(true);
    try {
      const response = await apiPost(`/api/sales/${selectedSale.id}/pay`, {
        metode: paymentMethod,
      });

      if (response.ok) {
        toast.success("Pembayaran berhasil!");
        setPayDialogOpen(false);
        fetchPendingSales();
      } else {
        toast.error("Gagal memproses pembayaran");
      }
    } catch {
      toast.error("Error: Gagal memproses");
    } finally {
      setProcessing(false);
    }
  };

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Receipt className="h-8 w-8 text-muted-foreground" />
        <h1 className="text-3xl font-bold">Daftar Bon (Belum Bayar)</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Total Bon Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{sales.length}</p>
          <p className="text-sm text-muted-foreground">
            Total: {formatCurrency(sales.reduce((sum, s) => sum + s.total, 0))}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada bon yang pending
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono">#{sale.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(sale.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {sale.tipe_pembeli}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(sale.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => openPayDialog(sale)}>
                        <CreditCard className="h-4 w-4 mr-1" />
                        Bayar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proses Pembayaran #{selectedSale?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Total Tagihan</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(selectedSale?.total || 0)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Metode Pembayaran</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Transfer Bank</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                onClick={handlePay}
                disabled={processing}
              >
                {processing && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Konfirmasi Bayar
              </Button>
              <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
