export interface User {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "kasir" | "mekanik";
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  mechanic?: {
    id: number;
    persentase_jasa: number;
  };
}

export interface RolesSummary {
  owner?: { total: number; active: number };
  admin?: { total: number; active: number };
  kasir?: { total: number; active: number };
  mekanik?: { total: number; active: number };
}
