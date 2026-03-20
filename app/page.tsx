import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
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
            Silakan login atau daftar untuk melanjutkan
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
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
        </div>
      </main>
    </div>
  );
}
