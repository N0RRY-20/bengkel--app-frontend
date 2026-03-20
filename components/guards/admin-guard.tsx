"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.email_verified_at) {
        // Redirect to verify-email if not verified
        router.push("/verify-email");
      } else if (user.role !== "admin") {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, router]);

  // Return null saat loading atau tidak authorized
  if (loading || !user || !user.email_verified_at || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
