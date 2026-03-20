"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useWorkOrder,
  removeServiceFromWorkOrder,
  removePartFromWorkOrder,
  finishWorkOrder,
} from "@/hooks/use-work-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { AddServiceDialog } from "@/components/work-order/add-service-dialog";
import { AddPartDialog } from "@/components/work-order/add-part-dialog";
import { PaymentDialog } from "@/components/work-order/payment-dialog";

export default function WorkOrderDetailPage() {
  const params = useParams();
  const workOrderId = parseInt(params.id as string);
  const { workOrder, loading, error, refetch } = useWorkOrder(workOrderId);

  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [addPartOpen, setAddPartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleFinish = async () => {
    if (!confirm("Tandai Work Order ini sebagai selesai?")) return;

    setActionLoading(true);
    try {
      await finishWorkOrder(workOrderId);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menandai selesai";
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveService = async (serviceId: number) => {
    if (!confirm("Hapus jasa ini?")) return;

    try {
      await removeServiceFromWorkOrder(workOrderId, serviceId);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus jasa";
      alert(message);
    }
  };

  const handleRemovePart = async (partId: number) => {
    if (!confirm("Hapus sparepart ini? Stok akan dikembalikan.")) return;

    try {
      await removePartFromWorkOrder(workOrderId, partId);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus sparepart";
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !workOrder) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || "Work Order tidak ditemukan"}
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dikerjakan":
        return (
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Dikerjakan
          </Badge>
        );
      case "selesai":
        return (
          <Badge
            variant="outline"
            className="text-lg px-4 py-1 border-yellow-500 text-yellow-600"
          >
            Selesai - Menunggu Pembayaran
          </Badge>
        );
      case "dibayar":
        return <Badge className="text-lg px-4 py-1 bg-green-500">Lunas</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const canEdit = workOrder.status !== "dibayar";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/kasir/work-orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Work Order #{workOrder.id}</h1>
          <p className="text-muted-foreground">
            {workOrder.plat_nomor} - {workOrder.nama_pemilik}
          </p>
        </div>
        {getStatusBadge(workOrder.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Mekanik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {workOrder.mechanic?.user?.name || "-"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Jasa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatCurrency(workOrder.total_jasa)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Sparepart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatCurrency(workOrder.total_parts)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Jasa</CardTitle>
          {canEdit && (
            <Button size="sm" onClick={() => setAddServiceOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah Jasa
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {workOrder.services?.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Belum ada jasa ditambahkan
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Jasa</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  {canEdit && <TableHead className="w-20"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrder.services?.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.nama_jasa}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(service.harga_jasa)}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRemoveService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Sparepart</CardTitle>
          {canEdit && (
            <Button size="sm" onClick={() => setAddPartOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah Sparepart
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {workOrder.parts?.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Belum ada sparepart ditambahkan
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Diskon</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  {canEdit && <TableHead className="w-20"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrder.parts?.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.nama_produk}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(part.harga)}
                    </TableCell>
                    <TableCell className="text-right">{part.qty}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(part.diskon)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(part.harga * part.qty - part.diskon)}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRemovePart(part.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">Grand Total</p>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(workOrder.grand_total)}
              </p>
            </div>
            <div className="flex gap-3">
              {workOrder.status === "dikerjakan" && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleFinish}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Tandai Selesai
                </Button>
              )}
              {workOrder.status === "selesai" && (
                <Button size="lg" onClick={() => setPaymentOpen(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proses Pembayaran
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AddServiceDialog
        open={addServiceOpen}
        onClose={() => setAddServiceOpen(false)}
        workOrderId={workOrderId}
        onSuccess={refetch}
      />
      <AddPartDialog
        open={addPartOpen}
        onClose={() => setAddPartOpen(false)}
        workOrderId={workOrderId}
        onSuccess={refetch}
      />
      <PaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        workOrderId={workOrderId}
        total={workOrder.grand_total}
        onSuccess={() => {
          refetch();
          setPaymentOpen(false);
        }}
      />
    </div>
  );
}
