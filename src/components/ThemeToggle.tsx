import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { GlassButton } from "@/components/GlassButton";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const next = theme === "dark" ? "light" : "dark";

  return (
  <GlassButton
      variant="secondary"
      onClick={() => setTheme(next)}
      className="relative gap-2"
      label={next === "dark" ? "Dark Mode" : "Light Mode"}
    />
  );
}
