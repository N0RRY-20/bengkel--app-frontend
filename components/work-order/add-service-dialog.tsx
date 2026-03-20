"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
import { addServiceToWorkOrder } from "@/hooks/use-work-orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ServiceMaster {
  id: number;
  nama_jasa: string;
  harga: number;
}

interface AddServiceDialogProps {
  open: boolean;
  onClose: () => void;
  workOrderId: number;
  onSuccess: () => void;
}

export function AddServiceDialog({
  open,
  onClose,
  workOrderId,
  onSuccess,
}: AddServiceDialogProps) {
  const [services, setServices] = useState<ServiceMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      fetchServices();
    }
  }, [open]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiGet<{ data: ServiceMaster[] }>("/api/services");
      if (response.ok) {
        setServices(response.data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (serviceId: number) => {
    setAdding(serviceId);
    try {
      await addServiceToWorkOrder(workOrderId, serviceId);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menambahkan jasa";
      alert(message);
    } finally {
      setAdding(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredServices = services.filter((s) =>
    s.nama_jasa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Tambah Jasa</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari jasa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredServices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada jasa ditemukan
            </p>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{service.nama_jasa}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(service.harga)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAdd(service.id)}
                  disabled={adding === service.id}
                >
                  {adding === service.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Tambah"
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
