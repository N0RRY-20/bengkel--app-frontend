"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { createWorkOrder } from "@/hooks/use-work-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Mechanic } from "@/types/work-order";

export default function CreateWorkOrderPage() {
  const router = useRouter();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMechanics, setLoadingMechanics] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama_pemilik: "",
    plat_nomor: "",
    mechanic_id: "",
  });

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await apiGet<{ data: Mechanic[] }>("/api/mechanics");
        if (response.ok) {
          setMechanics(response.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch mechanics:", err);
      } finally {
        setLoadingMechanics(false);
      }
    };

    fetchMechanics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createWorkOrder({
        nama_pemilik: formData.nama_pemilik,
        plat_nomor: formData.plat_nomor.toUpperCase(),
        mechanic_id: parseInt(formData.mechanic_id),
      });

      if (response.ok && response.data?.data) {
        router.push(`/kasir/work-orders/${response.data.data.id}`);
      } else {
        setError("Gagal membuat Work Order");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal membuat Work Order";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/kasir/work-orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Buat Work Order Baru</h1>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Data Kendaraan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="plat_nomor">Plat Nomor *</Label>
              <Input
                id="plat_nomor"
                placeholder="Contoh: AB1234CD"
                value={formData.plat_nomor}
                onChange={(e) =>
                  setFormData({ ...formData, plat_nomor: e.target.value })
                }
                required
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_pemilik">Nama Pemilik *</Label>
              <Input
                id="nama_pemilik"
                placeholder="Nama pemilik kendaraan"
                value={formData.nama_pemilik}
                onChange={(e) =>
                  setFormData({ ...formData, nama_pemilik: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mechanic_id">Pilih Mekanik *</Label>
              {loadingMechanics ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memuat mekanik...
                </div>
              ) : (
                <Select
                  value={formData.mechanic_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mechanic_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mekanik" />
                  </SelectTrigger>
                  <SelectContent>
                    {mechanics.map((mechanic) => (
                      <SelectItem
                        key={mechanic.id}
                        value={mechanic.id.toString()}
                      >
                        {mechanic.nama ||
                          mechanic.user?.name ||
                          `Mekanik #${mechanic.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Buat Work Order
              </Button>
              <Link href="/kasir/work-orders">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
