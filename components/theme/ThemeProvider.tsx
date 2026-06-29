"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense("Ngo9BigBOggjHTQxAR8/V1JHaF5cWWdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdlWXlccHRWQ2JfUUBzW0FWYEo=");

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
    setMounted(true);
  }, []);

  const toggleTheme = (e?: React.MouseEvent) => {
    if (typeof window === "undefined") return;

    // Check if we are already transitioning to avoid overlaps
    if (document.getElementById("theme-transition-overlay")) return;

    const nextTheme = theme === "light" ? "dark" : "light";

    // Get click coordinates, default to center of screen
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (e) {
      x = e.clientX;
      y = e.clientY;
    }

    // Create the overlay element
    const overlay = document.createElement("div");
    overlay.id = "theme-transition-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = nextTheme === "dark" ? "#0D0D12" : "#F9F8FF";
    overlay.style.zIndex = "99999";
    overlay.style.pointerEvents = "none";
    overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`;
    document.body.appendChild(overlay);

    // Animate the clip-path circle from 0% to 150% radius
    const animation = overlay.animate(
      [
        { clipPath: `circle(0% at ${x}px ${y}px)` },
        { clipPath: `circle(150% at ${x}px ${y}px)` }
      ],
      {
        duration: 500,
        easing: "ease-in-out",
        fill: "forwards"
      }
    );

    animation.onfinish = () => {
      // Swap theme class on html
      setTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
      document.documentElement.className = nextTheme;
      // Clean up overlay
      overlay.remove();
    };
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={mounted ? "contents" : "opacity-0"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
