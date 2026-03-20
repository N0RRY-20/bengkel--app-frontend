export interface Product {
  id: number;
  nama: string;
  harga_jual: number;
  stok: number;
  tipe_pembeli: "umum" | "bengkel";
  created_at?: string;
  updated_at?: string;
}

export interface ServiceMaster {
  id: number;
  nama_jasa: string;
  harga: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Mechanic {
  id: number;
  user_id: number;
  persentase_jasa: number;
  // Flat fields from API index endpoint
  nama?: string;
  email?: string;
  persentase_display?: string;
  // Nested user object (for show/detail endpoints)
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
