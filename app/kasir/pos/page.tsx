"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Minus, Trash2, ShoppingCart, Banknote, CreditCard, QrCode } from "lucide-react";

interface CartItem {
  product_id: number;
  nama: string;
  harga: number;
  qty: number;
  stok: number;
}

export default function POSPage() {
  const { products, loading } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "qris">("cash");

  const filteredProducts = products.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: (typeof products)[0]) => {
    const existing = cart.find((c) => c.product_id === product.id);
    if (existing) {
      if (existing.qty >= product.stok) {
        setMessage({ type: "error", text: "Stok tidak mencukupi" });
        setTimeout(() => setMessage(null), 2000);
        return;
      }
      setCart(
        cart.map((c) =>
          c.product_id === product.id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      if (product.stok < 1) {
        setMessage({ type: "error", text: "Stok habis" });
        setTimeout(() => setMessage(null), 2000);
        return;
      }
      setCart([
        ...cart,
        {
          product_id: product.id,
          nama: product.nama,
          harga: product.harga_jual,
          qty: 1,
          stok: product.stok,
        },
      ]);
    }
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(
      cart.map((c) => {
        if (c.product_id === productId) {
          const newQty = c.qty + delta;
          if (newQty > c.stok) {
            setMessage({ type: "error", text: "Stok tidak mencukupi" });
            setTimeout(() => setMessage(null), 2000);
            return c;
          }
          if (newQty < 1) return c;
          return { ...c, qty: newQty };
        }
        return c;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((c) => c.product_id !== productId));
  };

  const total = cart.reduce((sum, c) => sum + c.harga * c.qty, 0);

  const handleSaveBon = async () => {
    if (cart.length === 0) return;

    setProcessing(true);
    try {
      const response = await apiPost("/api/sales", {
        items: cart.map((c) => ({
          product_id: c.product_id,
          qty: c.qty,
          diskon: 0,
        })),
        tipe_pembeli: "umum",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Bon berhasil disimpan!" });
        setCart([]);
      } else {
        setMessage({ type: "error", text: "Gagal menyimpan bon" });
      }
    } catch {
      setMessage({ type: "error", text: "Error: Gagal menyimpan" });
    } finally {
      setProcessing(false);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Keranjang kosong" });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setProcessing(true);
    try {
      const createResponse = await apiPost<{ data: { id: number } }>(
        "/api/sales",
        {
          items: cart.map((c) => ({
            product_id: c.product_id,
            qty: c.qty,
            diskon: 0,
          })),
          tipe_pembeli: "umum",
        }
      );

      if (!createResponse.ok || !createResponse.data?.data?.id) {
        setMessage({ type: "error", text: "Gagal membuat penjualan" });
        setTimeout(() => setMessage(null), 2000);
        return;
      }

      const saleId = createResponse.data.data.id;

      const payResponse = await apiPost(`/api/sales/${saleId}/pay`, {
        metode: paymentMethod,
      });

      if (payResponse.ok) {
        setMessage({ type: "success", text: "Transaksi berhasil! (Lunas)" });
        setCart([]);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: "Penjualan dibuat tapi gagal memproses pembayaran",
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      setMessage({ type: "error", text: "Error: Gagal memproses" });
      setTimeout(() => setMessage(null), 2000);
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

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 space-y-4">
        <Input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer hover:border-primary transition-colors ${
                  product.stok === 0 ? "opacity-50" : ""
                }`}
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <p className="font-semibold truncate">{product.nama}</p>
                  <p className="text-primary font-bold">
                    {formatCurrency(product.harga_jual)}
                  </p>
                  <Badge
                    variant={product.stok > 5 ? "secondary" : "destructive"}
                  >
                    Stok: {product.stok}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Card className="w-96 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang ({cart.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {message && (
            <div
              className={`p-2 mb-3 rounded text-sm text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keranjang kosong
            </p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-2 p-2 border rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{item.nama}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.harga)} × {item.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => updateQty(item.product_id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => updateQty(item.product_id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-red-500"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={cart.length === 0 || processing}
              onClick={handleSaveBon}
            >
              Simpan Bon
            </Button>
            <Button
              className="flex-1"
              disabled={cart.length === 0 || processing}
              onClick={() => setPayDialogOpen(true)}
            >
              Bayar Langsung
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(total)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setPaymentMethod("cash")}
              >
                <Banknote className="h-6 w-6" />
                <span>Cash</span>
              </Button>
              <Button
                variant={paymentMethod === "transfer" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setPaymentMethod("transfer")}
              >
                <CreditCard className="h-6 w-6" />
                <span>Transfer</span>
              </Button>
              <Button
                variant={paymentMethod === "qris" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setPaymentMethod("qris")}
              >
                <QrCode className="h-6 w-6" />
                <span>QRIS</span>
              </Button>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={processing}
              onClick={() => {
                setPayDialogOpen(false);
                handleCheckout();
              }}
            >
              {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Konfirmasi Pembayaran
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
