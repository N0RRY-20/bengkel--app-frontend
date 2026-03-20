export interface DailyReport {
  date: string;
  summary: {
    total_transactions: number;
    total_income: number;
  };
  by_method: Record<string, { count: number; total: number }>;
  by_source: Record<string, { count: number; total: number }>;
}

export interface MonthlyReport {
  period: string;
  summary: {
    total_transactions: number;
    total_income: number;
    average_per_day: number;
  };
  daily_breakdown: Record<string, { count: number; total: number }>;
}

export interface MechanicsReport {
  period: string;
  data: Array<{
    id: number;
    nama: string;
    total_wo: number;
    total_jasa: number;
    persentase: number;
    pendapatan: number;
  }>;
  total_dibayar: number;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  description: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

export interface Correction {
  id: number;
  source_type: string;
  source_id: number;
  sebelum: Record<string, unknown>;
  sesudah: Record<string, unknown>;
  alasan: string;
  owner_id: number;
  created_at: string;
  owner: {
    id: number;
    name: string;
  };
}
