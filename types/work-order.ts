export interface Mechanic {
  id: number;
  user_id: number;
  persentase_jasa: number;
  // Flat fields from API index
  nama?: string;
  email?: string;
  persentase_display?: string;
  // Nested user object (for show endpoint)
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface WorkOrderService {
  id: number;
  work_order_id: number;
  nama_jasa: string;
  harga_jasa: number;
}

export interface WorkOrderPart {
  id: number;
  work_order_id: number;
  product_id: number;
  nama_produk: string;
  harga: number;
  qty: number;
  diskon: number;
}

export interface WorkOrder {
  id: number;
  nama_pemilik: string;
  plat_nomor: string;
  mechanic_id: number;
  created_by: number;
  status: "dikerjakan" | "selesai" | "dibayar";
  created_at: string;
  updated_at: string;
  mechanic?: Mechanic;
  creator?: {
    id: number;
    name: string;
  };
  services?: WorkOrderService[];
  parts?: WorkOrderPart[];
}

export interface WorkOrderDetail extends WorkOrder {
  total_jasa: number;
  total_parts: number;
  grand_total: number;
}
