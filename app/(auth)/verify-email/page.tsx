"use client";

import { useState } from "react";
import { GalleryVerticalEnd, Mail, RefreshCw, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function VerifyEmailPage() {
  const { user, logout } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      const { ok, data } = await apiPost<{ message?: string }>(
        "/api/email/verification-notification",
        {}
      );

      if (ok) {
        setResendSuccess(true);
      } else {
        setError(data.message || "Gagal mengirim ulang email verifikasi.");
      }
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          TK Harapan Bunda
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="size-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Verifikasi Email Anda</CardTitle>
            <CardDescription className="text-balance">
              Kami telah mengirimkan link verifikasi ke email Anda
              {user?.email && (
                <span className="block mt-1 font-medium text-foreground">
                  {user.email}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p>
                Silakan cek inbox email Anda dan klik link verifikasi yang kami
                kirimkan. Jika tidak menemukan email, cek juga folder spam.
              </p>
            </div>

            {resendSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                <CheckCircle className="size-4" />
                Email verifikasi berhasil dikirim ulang!
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 size-4" />
                    Kirim Ulang Email Verifikasi
                  </>
                )}
              </Button>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                Logout dan Gunakan Email Lain
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
