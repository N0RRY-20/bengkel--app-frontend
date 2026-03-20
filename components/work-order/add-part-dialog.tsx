"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
import { addPartToWorkOrder } from "@/hooks/use-work-orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Minus, Plus } from "lucide-react";

interface Product {
  id: number;
  nama: string;
  harga_jual: number;
  stok: number;
}

interface AddPartDialogProps {
  open: boolean;
  onClose: () => void;
  workOrderId: number;
  onSuccess: () => void;
}

export function AddPartDialog({
  open,
  onClose,
  workOrderId,
  onSuccess,
}: AddPartDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [diskon, setDiskon] = useState(0);

  useEffect(() => {
    if (open) {
      fetchProducts();
      setSelectedProduct(null);
      setQty(1);
      setDiskon(0);
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiGet<{ data: Product[] }>("/api/products");
      if (response.ok) {
        setProducts(response.data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedProduct) return;

    setAdding(true);
    try {
      await addPartToWorkOrder(workOrderId, {
        product_id: selectedProduct.id,
        qty,
        diskon,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menambahkan sparepart";
      alert(message);
    } finally {
      setAdding(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredProducts = products.filter(
    (p) => p.nama.toLowerCase().includes(search.toLowerCase()) && p.stok > 0
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selectedProduct ? "Atur Jumlah" : "Pilih Sparepart"}
          </DialogTitle>
        </DialogHeader>

        {!selectedProduct ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
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
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Tidak ada produk ditemukan
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div>
                      <p className="font-medium">{product.nama}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(product.harga_jual)} · Stok:{" "}
                        {product.stok}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold">{selectedProduct.nama}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(selectedProduct.harga_jual)} · Stok:{" "}
                {selectedProduct.stok}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Jumlah</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.min(
                        selectedProduct.stok,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQty(Math.min(selectedProduct.stok, qty + 1))
                  }
                  disabled={qty >= selectedProduct.stok}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diskon (Rp)</Label>
              <Input
                type="number"
                value={diskon}
                onChange={(e) => setDiskon(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-xl font-bold">
                  {formatCurrency(selectedProduct.harga_jual * qty - diskon)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedProduct(null)}
              >
                Kembali
              </Button>
              <Button className="flex-1" onClick={handleAdd} disabled={adding}>
                {adding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Tambahkan
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
