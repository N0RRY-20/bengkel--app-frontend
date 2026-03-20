"use client";

import { useState } from "react";
import { payWorkOrder } from "@/hooks/use-work-orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Banknote,
  CreditCard,
  QrCode,
  CheckCircle,
} from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  workOrderId: number;
  total: number;
  onSuccess: () => void;
}

export function PaymentDialog({
  open,
  onClose,
  workOrderId,
  total,
  onSuccess,
}: PaymentDialogProps) {
  const [method, setMethod] = useState<"cash" | "transfer" | "qris" | null>(
    null
  );
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handlePayment = async () => {
    if (!method) return;

    setProcessing(true);
    try {
      await payWorkOrder(workOrderId, method);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
        setMethod(null);
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memproses pembayaran";
      alert(message);
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    if (!processing) {
      onClose();
      setMethod(null);
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Proses Pembayaran</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600">
              Pembayaran Berhasil!
            </h3>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pembayaran</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(total)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Metode Pembayaran</p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={method === "cash" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setMethod("cash")}
                >
                  <Banknote className="h-6 w-6" />
                  <span>Cash</span>
                </Button>
                <Button
                  variant={method === "transfer" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setMethod("transfer")}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Transfer</span>
                </Button>
                <Button
                  variant={method === "qris" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setMethod("qris")}
                >
                  <QrCode className="h-6 w-6" />
                  <span>QRIS</span>
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!method || processing}
              onClick={handlePayment}
            >
              {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Konfirmasi Pembayaran
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
