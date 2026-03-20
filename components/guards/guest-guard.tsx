"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard - Mencegah user yang sudah login mengakses halaman login/register
 *
 * Jika user sudah login, redirect ke dashboard sesuai role-nya
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // User sudah login, redirect ke dashboard sesuai role
      switch (user.role) {
        case "owner":
          router.push("/owner/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "kasir":
          router.push("/kasir/dashboard");
          break;
        case "mekanik":
          router.push("/mekanik/dashboard");
          break;
        default:
          router.push("/user/dashboard");
      }
    }
  }, [user, loading, router]);

  // Return null saat loading atau user sudah login
  if (loading || user) {
    return null;
  }

  return <>{children}</>;
}
