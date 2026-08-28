import { Moon, Sun } from "lucide-react";
import { useStudio } from "@/lib/store";
import { useT } from "@/lib/use-t";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useStudio((s) => s.theme);
  const toggleTheme = useStudio((s) => s.toggleTheme);
  const t = useT();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      className={className ?? "grid size-11 place-items-center border border-line bg-paper text-ink"}
      onClick={toggleTheme}
      aria-label={dark ? t.themeLight : t.themeDark}
      aria-pressed={dark}
      title={dark ? t.themeLight : t.themeDark}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
