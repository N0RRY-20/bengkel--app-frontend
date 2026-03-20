"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  GalleryVerticalEnd,
  KeyRound,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password harus minimal 8 karakter.",
    }),
    password_confirmation: z.string().min(8, {
      message: "Konfirmasi password harus minimal 8 karakter.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak cocok.",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Gunakan useMemo untuk menghindari setState dalam useEffect
  const error = useMemo(() => {
    if (!token || !email) {
      return "Link reset password tidak valid. Silakan request ulang.";
    }
    return null;
  }, [token, email]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    if (!token || !email) return;

    try {
      const { ok, data } = await apiPost<{
        success?: boolean;
        message?: string;
      }>("/api/reset-password", {
        token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      if (ok && data.success) {
        setIsSuccess(true);
      } else {
        form.setError("root", {
          message: data.message || "Gagal reset password.",
        });
      }
    } catch {
      form.setError("root", {
        message: "Gagal menghubungi server.",
      });
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="size-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">Link Tidak Valid</CardTitle>
          <CardDescription className="text-balance">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/forgot-password" className="block">
            <Button className="w-full">Request Link Baru</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">Password Berhasil Direset!</CardTitle>
          <CardDescription className="text-balance">
            Password Anda telah berhasil diubah. Silakan login dengan password
            baru Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="block">
            <Button className="w-full">Masuk ke Akun</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
          <KeyRound className="size-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription className="text-balance">
          Masukkan password baru untuk akun{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                {form.formState.errors.root.message}
              </div>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>Minimal 8 karakter.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Password Baru"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense
          fallback={
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <Spinner className="size-8" />
              </CardContent>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
