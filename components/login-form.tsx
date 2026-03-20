"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { apiPost, setAuthData } from "@/lib/api";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Email tidak valid.",
  }),
  password: z.string().min(1, {
    message: "Password harus diisi.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

import { useAuth } from "@/lib/auth-context";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const { ok, data } = await apiPost<{
        access_token: string;
        user: {
          role?: string;
          email_verified_at?: string | null;
          [key: string]: unknown;
        };
        message?: string;
        errors?: Record<string, string[]>;
        email_verified?: boolean;
        redirect?: string;
      }>("/api/login", values);

      if (ok) {
        // Gunakan login dari context agar state langsung update
        // Casting user ke tipe yang sesuai dengan AuthContext
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        login(data.access_token, data.user as any);

        const userRole = data.user?.role;

        if (!userRole) {
          console.error("Role tidak ditemukan dalam response:", data);
          form.setError("root", {
            message: "Terjadi kesalahan: Role tidak ditemukan.",
          });
          return;
        }

        // Cek apakah email sudah diverifikasi
        if (
          data.email_verified === false ||
          data.redirect === "/verify-email"
        ) {
          toast.warning(
            data.message || "Silakan verifikasi email Anda terlebih dahulu."
          );
          router.push("/verify-email");
          return;
        }

        toast.success("Selamat datang kembali!");

        switch (userRole) {
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
      } else {
        // Set error untuk field atau root error
        if (data.errors) {
          Object.keys(data.errors).forEach((key) => {
            const fieldName = key as keyof FormValues;
            form.setError(fieldName, {
              type: "server",
              message: data.errors![key][0],
            });
          });
        } else {
          form.setError("root", {
            message: data.message || "Email atau password salah.",
          });
        }
      }
    } catch (error) {
      console.error("Network Error:", error);
      form.setError("root", {
        message: "Gagal menghubungi server.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Masuk Aplikasi</CardTitle>
          <CardDescription>
            Silakan masuk untuk mengakses portal TK
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {form.formState.errors.root && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Lupa password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Field>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2" />
                        Memuat...
                      </>
                    ) : (
                      "Masuk (Login)"
                    )}
                  </Button>
                </Field>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Atau
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    window.location.href = `${
                      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
                    }/auth/redirect`;
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 mr-2"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Masuk dengan Google
                </Button>

                <FieldDescription className="text-center mt-4">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:underline"
                  >
                    Daftar di sini
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
