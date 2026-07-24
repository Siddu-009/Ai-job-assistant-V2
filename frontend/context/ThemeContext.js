import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      setDarkMode(true);
    }

    const handleStorage = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("themechange", handleStorage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("themechange", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };

  }, []);

  const toggleTheme = () => {

    const next = !darkMode;

    setDarkMode(next);

    localStorage.setItem("theme", next ? "dark" : "light");

    window.dispatchEvent(new Event("themechange"));
  };

  const colors = {
    background: darkMode ? "#020617" : "#f1f5f9",
    card: darkMode ? "#0f172a" : "#ffffff",
    text: darkMode ? "#ffffff" : "#111827",
    subText: darkMode ? "#94a3b8" : "#64748b",
    borderStyle: darkMode
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(226,232,240,1)",
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        colors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}