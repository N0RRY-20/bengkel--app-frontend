export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export type UserRole = "owner" | "admin" | "kasir" | "mekanik";
