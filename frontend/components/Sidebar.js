import { useRouter } from "next/router";
import menu from "./layout/menu";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter();

  const { colors, darkMode, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("theme");
    router.replace("/login");
  };

  /*
   * Theme-aware colors
   * ------------------
   * We do NOT use fixed white/gray colors for normal
   * sidebar content because those disappear in light mode.
   */

  const theme = {
    sidebarBg: darkMode ? "#0f172a" : "#ffffff",

    sidebarBorder: darkMode
      ? "rgba(148, 163, 184, 0.18)"
      : "rgba(15, 23, 42, 0.10)",

    textPrimary: darkMode ? "#f8fafc" : "#0f172a",

    textSecondary: darkMode ? "#cbd5e1" : "#475569",

    textMuted: darkMode ? "#94a3b8" : "#64748b",

    iconColor: darkMode ? "#cbd5e1" : "#475569",

    hoverBg: darkMode
      ? "rgba(255,255,255,0.08)"
      : "rgba(37,99,235,0.07)",

    activeBg: "#2563eb",

    activeText: "#ffffff",

    buttonBg: darkMode ? "#1e293b" : "#f1f5f9",

    buttonBorder: darkMode
      ? "rgba(148,163,184,0.20)"
      : "rgba(15,23,42,0.10)",

    buttonText: darkMode ? "#f8fafc" : "#1e293b",

    divider: darkMode
      ? "rgba(148,163,184,0.16)"
      : "rgba(15,23,42,0.10)",
  };

  /*
   * Footer button
   */

  const footerBtn = (background) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "flex-start",

    gap: "12px",

    width: "100%",

    minHeight: "46px",

    padding: collapsed ? "10px" : "11px 14px",

    border: "1px solid transparent",

    borderRadius: "12px",

    background,

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "14px",

    fontWeight: 600,

    lineHeight: 1,

    transition:
      "background 0.2s ease, transform 0.2s ease, opacity 0.2s ease",

    boxSizing: "border-box",
  });

  return (
    <aside
      aria-label="Main navigation"
      style={{
        width: collapsed ? "90px" : "290px",

        height: "100vh",

        background: theme.sidebarBg,

        color: theme.textPrimary,

        display: "flex",

        flexDirection: "column",

        position: "sticky",

        top: 0,

        overflow: "hidden",

        boxSizing: "border-box",

        flexShrink: 0,

        borderRight: `1px solid ${theme.sidebarBorder}`,

        boxShadow: darkMode
          ? "4px 0 20px rgba(0,0,0,0.25)"
          : "4px 0 20px rgba(15,23,42,0.06)",

        transition:
          "width 0.3s ease, background 0.3s ease, border-color 0.3s ease",

        zIndex: 100,
      }}
    >
      {/* ============================================================
          BRAND / COLLAPSE BUTTON
          ============================================================ */}

      <div
        style={{
          minHeight: "92px",

          padding: collapsed ? "20px 15px" : "20px 20px",

          borderBottom: `1px solid ${theme.divider}`,

          display: "flex",

          justifyContent: collapsed
            ? "center"
            : "space-between",

          alignItems: "center",

          gap: "12px",

          boxSizing: "border-box",
        }}
      >
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: 0,

                fontSize: "22px",

                lineHeight: 1.2,

                fontWeight: 800,

                color: theme.textPrimary,

                letterSpacing: "-0.4px",

                whiteSpace: "nowrap",
              }}
            >
              AI Job
            </h2>

            <p
              style={{
                margin: "5px 0 0",

                fontSize: "13px",

                lineHeight: 1.2,

                color: theme.textMuted,

                whiteSpace: "nowrap",
              }}
            >
              Assistant v3
            </p>
          </div>
        )}

        {/* ========================================================
            COLLAPSE / EXPAND BUTTON

            IMPORTANT:
            This button now has a visible background, border
            and theme-aware icon color in BOTH modes.
            ======================================================== */}

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          style={{
            width: "38px",

            height: "38px",

            minWidth: "38px",

            borderRadius: "11px",

            border: `1px solid ${theme.buttonBorder}`,

            background: theme.buttonBg,

            color: theme.buttonText,

            cursor: "pointer",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            padding: 0,

            flexShrink: 0,

            transition:
              "all 0.2s ease",

            boxShadow: darkMode
              ? "0 2px 8px rgba(0,0,0,0.18)"
              : "0 2px 8px rgba(15,23,42,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              darkMode
                ? "#334155"
                : "#e2e8f0";

            e.currentTarget.style.transform =
              "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              theme.buttonBg;

            e.currentTarget.style.transform =
              "scale(1)";
          }}
        >
          {collapsed ? (
            <ChevronRight
              size={20}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          ) : (
            <ChevronLeft
              size={20}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* ============================================================
          NAVIGATION
          ============================================================ */}

      <nav
        aria-label="Application navigation"
        style={{
          padding: "18px 15px",

          flex: 1,

          overflowY: "auto",

          overflowX: "hidden",

          scrollbarWidth: "thin",

          boxSizing: "border-box",
        }}
      >
        {menu.map((section) => (
          <div
            key={section.title}
            style={{
              marginBottom: "22px",
            }}
          >
            {/* Section title */}

            {!collapsed && (
              <p
                style={{
                  fontSize: "11px",

                  color: theme.textMuted,

                  margin:
                    "0 10px 9px",

                  letterSpacing: "1px",

                  fontWeight: 700,

                  textTransform: "uppercase",

                  lineHeight: 1.4,
                }}
              >
                {section.title}
              </p>
            )}

            {/* Menu items */}

            {section.items.map((item) => {
              const Icon = item.icon;

              const active =
                router.pathname === item.href ||
                (item.href !== "/" &&
                  router.pathname.startsWith(
                    item.href
                  ));

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    if (
                      router.pathname !==
                      item.href
                    ) {
                      router.push(item.href);
                    }
                  }}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  style={{
                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                      collapsed
                        ? "center"
                        : "flex-start",

                    gap: "14px",

                    width: "100%",

                    minHeight: "46px",

                    padding: collapsed
                      ? "10px"
                      : "10px 13px",

                    marginBottom: "5px",

                    border: active
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid transparent",

                    borderRadius: "12px",

                    cursor: "pointer",

                    background: active
                      ? theme.activeBg
                      : "transparent",

                    color: active
                      ? theme.activeText
                      : theme.textSecondary,

                    textAlign: "left",

                    boxShadow: active
                      ? "0 6px 16px rgba(37,99,235,0.25)"
                      : "none",

                    transition:
                      "background 0.18s ease, color 0.18s ease, transform 0.18s ease",

                    boxSizing: "border-box",

                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background =
                        theme.hoverBg;

                      e.currentTarget.style.color =
                        theme.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background =
                        "transparent";

                      e.currentTarget.style.color =
                        theme.textSecondary;
                    }
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.3 : 2}
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,

                      color: active
                        ? "#ffffff"
                        : theme.iconColor,

                      transition:
                        "color 0.18s ease",
                    }}
                  />

                  {!collapsed && (
                    <span
                      style={{
                        fontSize: "15px",

                        fontWeight:
                          active
                            ? 600
                            : 500,

                        color: "inherit",

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ============================================================
          FOOTER
          ============================================================ */}

      <div
        style={{
          padding: "15px",

          borderTop:
            `1px solid ${theme.divider}`,

          display: "flex",

          flexDirection: "column",

          gap: "9px",

          background: theme.sidebarBg,

          boxSizing: "border-box",
        }}
      >
        {/* ========================================================
            THEME BUTTON
            ======================================================== */}

        <button
          type="button"
          onClick={toggleTheme}
          style={footerBtn(
            darkMode
              ? "#1e293b"
              : "#334155"
          )}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {darkMode ? (
            <Sun
              size={20}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          ) : (
            <Moon
              size={20}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          )}

          {!collapsed && (
            <span>
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          )}
        </button>

        {/* ========================================================
            LOGOUT
            ======================================================== */}

        <button
          type="button"
          onClick={logout}
          style={footerBtn("#dc2626")}
          title="Logout"
        >
          <LogOut
            size={20}
            strokeWidth={2.2}
            aria-hidden="true"
          />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}