import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import menu from "./layout/menu";
import { ChevronLeft, ChevronRight, LogOut, Moon, Sun } from "lucide-react";

// ─── component ────────────────────────────────────────────────────────────────

export default function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);

  // ── Hydrate theme from localStorage (don't rely on body.style) ────────────
  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");

    const onStorage = (e) => {
      if (e.key === "theme") setDarkMode(e.newValue === "dark");
    };
    const onCustom = () => setDarkMode(localStorage.getItem("theme") === "dark");

    window.addEventListener("storage",     onStorage);
    window.addEventListener("themechange", onCustom);
    return () => {
      window.removeEventListener("storage",     onStorage);
      window.removeEventListener("themechange", onCustom);
    };
  }, []);

  // FIXED: old toggleTheme mutated document.body.style directly, which:
  //   1. Only changed the body background — nothing else in the UI updated.
  //   2. Did not persist the theme to localStorage.
  //   3. Used stale `darkMode` value in the condition (classic closure bug —
  //      `!darkMode` inside setState would read the captured value, not current).
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("themechange"));
  };

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  // Shared icon-button style
  const footerBtn = (bg) => ({
    display:        "flex",
    alignItems:     "center",
    justifyContent: collapsed ? "center" : "flex-start",
    gap:            "12px",
    width:          "100%",
    padding:        "12px 15px",
    border:         "none",
    borderRadius:   "12px",
    background:     bg,
    color:          "#ffffff",
    cursor:         "pointer",
    fontSize:       "14px",
    fontWeight:     600,
    // FIXED: `transition: ".25s"` is invalid — property name was missing.
    transition:     "opacity 0.2s ease",
  });

  return (
    <aside
      aria-label="Main navigation"
      style={{
        width:         collapsed ? "90px" : "290px",
        height:        "100vh",
        background:    "#111827",
        color:         "#ffffff",
        display:       "flex",
        flexDirection: "column",
        // FIXED: `transition: "0.3s"` is invalid — property name missing.
        transition:    "width 0.3s ease",
        position:      "sticky",
        top:           0,
        overflowY:     "auto",
        boxShadow:     "4px 0 20px rgba(0,0,0,0.15)",
        boxSizing:     "border-box",
        flexShrink:    0,
      }}
    >
      {/* ── Brand ── */}
      <div
        style={{
          padding:        "25px",
          borderBottom:   "1px solid rgba(255,255,255,0.08)",
          display:        "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems:     "center",
          gap:            "12px",
        }}
      >
        {!collapsed && (
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800 }}>AI Job</h2>
            <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#9ca3af" }}>
              Assistant v3
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background:   "rgba(255,255,255,0.06)",
            border:       "none",
            borderRadius: "10px",
            cursor:       "pointer",
            color:        "#ffffff",
            width:        "36px",
            height:       "36px",
            display:      "grid",
            placeItems:   "center",
            flexShrink:   0,
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ── Nav ── */}
      {/* FIXED: nav items were <div onClick> — not keyboard accessible.
          Replaced with <button> so they're reachable via Tab and
          activatable with Enter/Space. */}
      <nav style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
        {menu.map((section) => (
          <div key={section.title} style={{ marginBottom: "25px" }}>

            {!collapsed && (
              <p
                style={{
                  fontSize:      "11px",
                  color:         "#6b7280",
                  marginBottom:  "10px",
                  marginTop:     0,
                  letterSpacing: "1px",
                  fontWeight:    700,
                  textTransform: "uppercase",
                }}
              >
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const Icon   = item.icon;
              const active = router.pathname === item.href ||
                (item.href !== "/" && router.pathname.startsWith(item.href));

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap:            "14px",
                    width:          "100%",
                    padding:        collapsed ? "12px" : "12px 15px",
                    marginBottom:   "4px",
                    border:         "none",
                    borderRadius:   "12px",
                    cursor:         "pointer",
                    background:     active ? "#2563eb" : "transparent",
                    color:          active ? "#ffffff" : "#d1d5db",
                    textAlign:      "left",
                    boxShadow:      active ? "0 6px 16px rgba(37,99,235,0.3)" : "none",
                    transition:     "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={20} aria-hidden="true" />
                  {!collapsed && (
                    <span style={{ fontSize: "15px", fontWeight: active ? 600 : 500 }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div
        style={{
          padding:   "20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display:   "flex",
          flexDirection: "column",
          gap:       "10px",
        }}
      >
        <button
          onClick={toggleTheme}
          style={footerBtn("#1f2937")}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        <button
          onClick={logout}
          style={footerBtn("#dc2626")}
          title="Logout"
        >
          <LogOut size={20} aria-hidden="true" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
