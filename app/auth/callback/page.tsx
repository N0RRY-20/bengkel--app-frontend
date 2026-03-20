"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthData } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userData = searchParams.get("user");
    const redirectPath = searchParams.get("redirect");
    const error = searchParams.get("error");

    if (error) {
      window.location.href = `/login?error=${error}`;
      return;
    }

    if (token && userData) {
      try {
        const user = JSON.parse(atob(userData));
        setAuthData(token, user);

        // Determine redirect path based on role if not provided
        let targetPath = redirectPath;
        if (!targetPath && user.role) {
          switch (user.role) {
            case "owner":
              targetPath = "/owner/dashboard";
              break;
            case "admin":
              targetPath = "/admin/dashboard";
              break;
            case "kasir":
              targetPath = "/kasir/dashboard";
              break;
            case "mekanik":
              targetPath = "/mekanik/dashboard";
              break;
            default:
              targetPath = "/user/dashboard";
          }
        }

        window.location.href = targetPath || "/user/dashboard";
      } catch {
        console.error("Failed to parse user data");
        window.location.href = "/login?error=invalid_data";
      }
    } else {
      window.location.href = "/login?error=missing_data";
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <Spinner className="mx-auto size-8" />
        <p className="mt-4 text-muted-foreground">Memproses login...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
