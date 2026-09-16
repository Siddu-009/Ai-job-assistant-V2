import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  BrainCircuit,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

const menus = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Resume Center",
    href: "/resume-center",
    icon: FileText,
  },
  {
    title: "ATS Analyzer",
    href: "/ats-score",
    icon: Target,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "AI Tools",
    href: "/career-coach",
    icon: BrainCircuit,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  collapsed = false,
  setCollapsed,
}: SidebarProps) {
  const router = useRouter();

  const { darkMode, toggleTheme } = useTheme();

  /*
   * ============================================================
   * THEME COLORS
   * ============================================================
   */

  const colors = {
    sidebarBg: darkMode ? "#0f172a" : "#ffffff",

    primaryText: darkMode ? "#f8fafc" : "#0f172a",

    secondaryText: darkMode ? "#cbd5e1" : "#475569",

    mutedText: darkMode ? "#94a3b8" : "#64748b",

    icon: darkMode ? "#cbd5e1" : "#475569",

    border: darkMode
      ? "rgba(148,163,184,0.16)"
      : "rgba(15,23,42,0.10)",

    buttonBg: darkMode ? "#1e293b" : "#f1f5f9",

    buttonBorder: darkMode
      ? "rgba(148,163,184,0.20)"
      : "rgba(15,23,42,0.10)",

    hoverBg: darkMode
      ? "rgba(255,255,255,0.08)"
      : "rgba(37,99,235,0.07)",

    activeBg: "#2563eb",

    activeText: "#ffffff",
  };

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("theme");

    router.replace("/login");
  };

  /*
   * ============================================================
   * FOOTER BUTTON
   * ============================================================
   */

  const footerButton = (background: string) => ({
    width: "100%",

    minHeight: "46px",

    padding: collapsed ? "10px" : "11px 14px",

    display: "flex",

    alignItems: "center",

    justifyContent: collapsed
      ? "center"
      : "flex-start",

    gap: "12px",

    border: "1px solid transparent",

    borderRadius: "12px",

    background,

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "14px",

    fontWeight: 600,

    boxSizing: "border-box" as const,

    transition:
      "background 0.2s ease, transform 0.2s ease",
  });

  return (
    <aside
      aria-label="Main navigation"
      style={{
        width: collapsed ? "90px" : "290px",

        height: "100vh",

        position: "sticky",

        top: 0,

        display: "flex",

        flexDirection: "column",

        background: colors.sidebarBg,

        color: colors.primaryText,

        borderRight:
          `1px solid ${colors.border}`,

        boxShadow: darkMode
          ? "4px 0 20px rgba(0,0,0,0.25)"
          : "4px 0 20px rgba(15,23,42,0.06)",

        overflow: "hidden",

        flexShrink: 0,

        boxSizing: "border-box",

        transition:
          "width 0.3s ease, background 0.3s ease, border-color 0.3s ease",

        zIndex: 100,
      }}
    >

      {/* ========================================================
          BRAND
          ======================================================== */}

      <div
        style={{
          minHeight: "92px",

          padding: collapsed
            ? "20px 15px"
            : "20px",

          display: "flex",

          alignItems: "center",

          justifyContent: collapsed
            ? "center"
            : "space-between",

          gap: "12px",

          borderBottom:
            `1px solid ${colors.border}`,

          boxSizing: "border-box",
        }}
      >

        {!collapsed && (
          <div>
            <h2
              style={{
                margin: 0,

                fontSize: "22px",

                fontWeight: 800,

                lineHeight: 1.2,

                color: colors.primaryText,

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

                color: colors.mutedText,

                whiteSpace: "nowrap",
              }}
            >
              Assistant v3
            </p>
          </div>
        )}

        {/* ======================================================
            COLLAPSE BUTTON
            ====================================================== */}

        {setCollapsed && (
          <button
            type="button"
            onClick={() =>
              setCollapsed(
                (value) => !value
              )
            }
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

              padding: 0,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              borderRadius: "11px",

              border:
                `1px solid ${colors.buttonBorder}`,

              background:
                colors.buttonBg,

              color:
                darkMode
                  ? "#f8fafc"
                  : "#1e293b",

              cursor: "pointer",

              flexShrink: 0,

              boxShadow: darkMode
                ? "0 2px 8px rgba(0,0,0,0.18)"
                : "0 2px 8px rgba(15,23,42,0.06)",

              transition:
                "all 0.2s ease",
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
                colors.buttonBg;

              e.currentTarget.style.transform =
                "scale(1)";
            }}
          >
            {collapsed ? (
              <ChevronRight
                size={20}
                strokeWidth={2.5}
              />
            ) : (
              <ChevronLeft
                size={20}
                strokeWidth={2.5}
              />
            )}
          </button>
        )}

      </div>

      {/* ========================================================
          NAVIGATION
          ======================================================== */}

      <nav
        aria-label="Application navigation"
        style={{
          flex: 1,

          padding: "18px 15px",

          overflowY: "auto",

          overflowX: "hidden",

          boxSizing: "border-box",
        }}
      >

        {!collapsed && (
          <p
            style={{
              margin:
                "0 10px 10px",

              fontSize: "11px",

              fontWeight: 700,

              letterSpacing: "1px",

              textTransform:
                "uppercase",

              color:
                colors.mutedText,
            }}
          >
            Main Menu
          </p>
        )}

        {menus.map((item) => {
          const Icon = item.icon;

          const active =
            router.pathname ===
              item.href ||
            (item.href !== "/" &&
              router.pathname.startsWith(
                item.href
              ));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={
                collapsed
                  ? item.title
                  : undefined
              }
              aria-current={
                active
                  ? "page"
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

                borderRadius: "12px",

                border: active
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid transparent",

                background: active
                  ? colors.activeBg
                  : "transparent",

                color: active
                  ? colors.activeText
                  : colors.secondaryText,

                textDecoration: "none",

                boxSizing:
                  "border-box",

                boxShadow: active
                  ? "0 6px 16px rgba(37,99,235,0.25)"
                  : "none",

                transition:
                  "background 0.18s ease, color 0.18s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background =
                    colors.hoverBg;

                  e.currentTarget.style.color =
                    colors.primaryText;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background =
                    "transparent";

                  e.currentTarget.style.color =
                    colors.secondaryText;
                }
              }}
            >

              <Icon
                size={20}
                strokeWidth={
                  active ? 2.3 : 2
                }
                style={{
                  flexShrink: 0,

                  color: active
                    ? "#ffffff"
                    : colors.icon,
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
                  }}
                >
                  {item.title}
                </span>
              )}

            </Link>
          );
        })}

      </nav>

      {/* ========================================================
          FOOTER
          ======================================================== */}

      <div
        style={{
          padding: "15px",

          borderTop:
            `1px solid ${colors.border}`,

          display: "flex",

          flexDirection: "column",

          gap: "9px",

          background:
            colors.sidebarBg,

          boxSizing: "border-box",
        }}
      >

        {/* ======================================================
            DARK / LIGHT MODE
            ====================================================== */}

        <button
          type="button"
          onClick={toggleTheme}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          style={footerButton(
            darkMode
              ? "#1e293b"
              : "#334155"
          )}
        >

          {darkMode ? (
            <Sun
              size={20}
              strokeWidth={2.2}
            />
          ) : (
            <Moon
              size={20}
              strokeWidth={2.2}
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

        {/* ======================================================
            LOGOUT
            ====================================================== */}

        <button
          type="button"
          onClick={logout}
          title="Logout"
          style={footerButton(
            "#dc2626"
          )}
        >

          <LogOut
            size={20}
            strokeWidth={2.2}
          />

          {!collapsed && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
}