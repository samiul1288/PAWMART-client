import { useEffect, useState } from "react";

/**
 * Toggle between "light" and "dark" (daisyUI themes)
 * Persists to localStorage('theme')
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <button className="btn btn-ghost" onClick={toggle} title="Toggle theme">
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
