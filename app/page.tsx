"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 font-sans transition-colors duration-300">
      <main className="flex flex-col items-center justify-center gap-8 p-8">
        <ThemeToggle />
        {/* Welcome Text */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Selamat Datang
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            {user
              ? `Halo, ${user.name}! Lanjutkan ke dashboard Anda.`
              : "Silakan login atau daftar untuk melanjutkan"}
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {loading ? (
            <div className="flex w-full justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : user ? (
            <Link
              href={`/${user.role}/dashboard`}
              className="flex-1 px-8 py-4 text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 ease-out"
            >
              Ke Dashboard
            </Link>
          ) : (
            <>
              {/* Register Button */}
              <Link
                href="/register"
                className="flex-1 px-8 py-4 text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 ease-out"
              >
                Register
              </Link>

              {/* Login Button */}
              <Link
                href="/login"
                className="flex-1 px-8 py-4 text-center font-semibold text-zinc-900 dark:text-white border-2 border-zinc-300 dark:border-zinc-600 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:border-zinc-400 dark:hover:border-zinc-500 hover:scale-105 transition-all duration-300 ease-out"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Demo Credentials */}
        {!user && !loading && (
          <div className="mt-8 p-6 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4 text-center">
              Akun Demo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Owner
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Email: owner@bengkel.com
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Pass: password
                </p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Admin
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Email: admin@bengkel.com
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Pass: password
                </p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Kasir
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Email: kasir@bengkel.com
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Pass: password
                </p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Mekanik
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Email: budi@bengkel.com
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Pass: password
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
