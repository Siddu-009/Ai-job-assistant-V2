import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // ==========================================================================
  // DARK MODE STATE
  // ==========================================================================

  const [darkMode, setDarkMode] = useState(false);

  // ==========================================================================
  // LOAD SAVED THEME
  // ==========================================================================

  useEffect(() => {
    try {
      const savedTheme =
        localStorage.getItem("theme");

      if (savedTheme === "dark") {
        setDarkMode(true);
      } else if (savedTheme === "light") {
        setDarkMode(false);
      } else {
        // Default theme
        setDarkMode(false);
      }
    } catch (error) {
      console.error(
        "Unable to load saved theme:",
        error
      );

      setDarkMode(false);
    }
  }, []);

  // ==========================================================================
  // APPLY THEME TO HTML DOCUMENT
  // ==========================================================================

  useEffect(() => {
    const theme =
      darkMode ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    // Useful for browser UI and native controls
    document.documentElement.style.colorScheme =
      theme;
  }, [darkMode]);

  // ==========================================================================
  // THEME TOGGLE
  // ==========================================================================

  const toggleTheme = () => {
    setDarkMode((previousMode) => {
      const nextMode = !previousMode;

      try {
        localStorage.setItem(
          "theme",
          nextMode ? "dark" : "light"
        );
      } catch (error) {
        console.error(
          "Unable to save theme:",
          error
        );
      }

      // Notify components that may listen for theme changes
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new Event("themechange")
        );
      }

      return nextMode;
    });
  };

  // ==========================================================================
  // THEME COLORS
  // ==========================================================================

  const colors = {
    // ========================================================================
    // MAIN PAGE
    // ========================================================================

    background: darkMode
      ? "#020617"
      : "#f1f5f9",

    // ========================================================================
    // CARDS / SURFACES
    // ========================================================================

    card: darkMode
      ? "#111827"
      : "#ffffff",

    cardSecondary: darkMode
      ? "#1e293b"
      : "#f8fafc",

    surface: darkMode
      ? "#1e293b"
      : "#f8fafc",

    // ========================================================================
    // TEXT
    // ========================================================================

    text: darkMode
      ? "#f8fafc"
      : "#111827",

    subText: darkMode
      ? "#cbd5e1"
      : "#64748b",

    muted: darkMode
      ? "#94a3b8"
      : "#9ca3af",

    // ========================================================================
    // BORDERS
    // ========================================================================

    border: darkMode
      ? "#334155"
      : "#e5e7eb",

    borderStyle: darkMode
      ? "1px solid #334155"
      : "1px solid #e5e7eb",

    // ========================================================================
    // INPUTS
    // ========================================================================

    inputBackground: darkMode
      ? "#0f172a"
      : "#ffffff",

    inputText: darkMode
      ? "#f8fafc"
      : "#111827",

    inputPlaceholder: darkMode
      ? "#94a3b8"
      : "#64748b",

    inputBorder: darkMode
      ? "#475569"
      : "#cbd5e1",

    inputFocusBorder: "#2563eb",

    // ========================================================================
    // HOVER
    // ========================================================================

    hover: darkMode
      ? "#1e293b"
      : "#f1f5f9",

    hoverStrong: darkMode
      ? "#334155"
      : "#e2e8f0",

    // ========================================================================
    // BADGES
    // ========================================================================

    successBg: darkMode
      ? "#14532d"
      : "#dcfce7",

    successText: darkMode
      ? "#bbf7d0"
      : "#166534",

    dangerBg: darkMode
      ? "#7f1d1d"
      : "#fee2e2",

    dangerText: darkMode
      ? "#fecaca"
      : "#b91c1c",

    infoBg: darkMode
      ? "#1e3a8a"
      : "#dbeafe",

    infoText: darkMode
      ? "#bfdbfe"
      : "#1d4ed8",

    // ========================================================================
    // CHIPS / TAGS
    // ========================================================================

    chipBg: darkMode
      ? "#334155"
      : "#f3f4f6",

    chipText: darkMode
      ? "#e2e8f0"
      : "#374151",

    // ========================================================================
    // BUTTONS
    // ========================================================================

    button: "#2563eb",

    buttonHover: "#1d4ed8",

    buttonText: "#ffffff",

    // ========================================================================
    // ICONS
    // ========================================================================

    icon: darkMode
      ? "#cbd5e1"
      : "#475569",

    iconHover: darkMode
      ? "#ffffff"
      : "#0f172a",

    // ========================================================================
    // NAVIGATION
    // ========================================================================

    navBackground: darkMode
      ? "#111827"
      : "#ffffff",

    navText: darkMode
      ? "#e2e8f0"
      : "#334155",

    navTextActive: "#2563eb",

    navHover: darkMode
      ? "#1e293b"
      : "#f1f5f9",

    // ========================================================================
    // SIDEBAR
    // ========================================================================

    sidebarBackground: darkMode
      ? "#0f172a"
      : "#ffffff",

    sidebarText: darkMode
      ? "#cbd5e1"
      : "#475569",

    sidebarActiveBackground: darkMode
      ? "rgba(37, 99, 235, 0.18)"
      : "#eff6ff",

    sidebarActiveText: "#2563eb",

    sidebarHover: darkMode
      ? "#1e293b"
      : "#f1f5f9",

    // ========================================================================
    // DROPDOWNS
    // ========================================================================

    dropdownBackground: darkMode
      ? "#172033"
      : "#ffffff",

    dropdownText: darkMode
      ? "#f8fafc"
      : "#111827",

    dropdownHover: darkMode
      ? "#263449"
      : "#f8fafc",

    dropdownBorder: darkMode
      ? "#334155"
      : "#e5e7eb",

    // ========================================================================
    // NOTIFICATIONS
    // ========================================================================

    notificationUnread: darkMode
      ? "rgba(37, 99, 235, 0.18)"
      : "#eff6ff",

    notificationRead: darkMode
      ? "#172033"
      : "#ffffff",

    // ========================================================================
    // STATUS
    // ========================================================================

    online: "#16a34a",

    offline: "#ef4444",

    warning: "#f59e0b",

    // ========================================================================
    // DANGER
    // ========================================================================

    danger: "#dc2626",
  };

  // ==========================================================================
  // PROVIDER
  // ==========================================================================

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

// ============================================================================
// USE THEME HOOK
// ============================================================================

export function useTheme() {
  const context = useContext(
    ThemeContext
  );

  if (!context) {
    throw new Error(
      "useTheme must be used inside a ThemeProvider"
    );
  }

  return context;
}