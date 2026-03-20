import { useCallback, useEffect, useState } from "react";

type Appearance = "light" | "dark" | "system";

function getInitialAppearance(): Appearance {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("appearance") as Appearance) || "system";
}

export function useAppearance() {
  const [appearance, setAppearance] =
    useState<Appearance>(getInitialAppearance);

  const updateAppearance = useCallback((mode: Appearance) => {
    setAppearance(mode);
    localStorage.setItem("appearance", mode);
    document.cookie = `appearance=${mode};path=/;max-age=31536000;SameSite=Lax`;
    applyTheme(mode);
  }, []);

  // Apply theme on mount
  useEffect(() => {
    applyTheme(appearance);
  }, [appearance]);

  return { appearance, updateAppearance };
}

function applyTheme(appearance: Appearance) {
  const isDark =
    appearance === "dark" ||
    (appearance === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}
