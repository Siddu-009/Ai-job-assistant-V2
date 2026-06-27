import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Search,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  LogOut,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

// FIXED: hardcoded personal email removed — pass user data via props
const NOTIF_COUNT = 3;

// FIXED: `transition: "0.25s"` is invalid — property name was missing.
const menuItemStyle = {
  display:    "flex",
  alignItems: "center",
  gap:        "12px",
  padding:    "13px 20px",
  cursor:     "pointer",
  fontSize:   "14px",
  fontWeight: 500,
  transition: "background 0.15s ease",
  color:      "#111827",
  textDecoration: "none",
  border:     "none",
  background: "transparent",
  width:      "100%",
  textAlign:  "left",
};

// ─── component ────────────────────────────────────────────────────────────────

export default function Navbar({
  collapsed,
  setCollapsed,
  userName  = "Siddardha",
  userRole  = "DevOps Engineer",
  userEmail = "user@example.com",
  userInitial = "S",
}) {
  const router = useRouter();

  const [search,      setSearch]      = useState("");
  const [darkMode,    setDarkMode]    = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs,  setShowNotifs]  = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  // ── Clock ────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Set immediately so there's no blank flash on first render
    setCurrentTime(new Date().toLocaleString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Theme sync ───────────────────────────────────────────────────────────
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

  // ── Outside-click: close dropdowns ───────────────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotifs(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // FIXED: old toggleTheme mutated document.body.style directly (only changed
  // body background, nothing else reacted) and never persisted to localStorage.
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("themechange"));
  };

  // FIXED: setCollapsed(!collapsed) reads stale closure value.
  const toggleCollapsed = () => setCollapsed((v) => !v);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header
      style={{
        height:         "75px",
        background:     "#ffffff",
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        padding:        "0 30px",
        borderBottom:   "1px solid #e5e7eb",
        position:       "sticky",
        top:            0,
        zIndex:         99,
        boxShadow:      "0 2px 10px rgba(0,0,0,0.04)",
        gap:            "16px",
      }}
    >
      {/* ── Left: toggle + search ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>

        {/* FIXED: <button> instead of bare onClick — keyboard accessible */}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            border:       "none",
            background:   "transparent",
            cursor:       "pointer",
            color:        "#374151",
            display:      "grid",
            placeItems:   "center",
            flexShrink:   0,
          }}
        >
          <Menu size={24} aria-hidden="true" />
        </button>

        {/* Search */}
        <label
          style={{
            position:     "relative",
            display:      "flex",
            alignItems:   "center",
            flexShrink:   1,
            minWidth:     0,
          }}
        >
          <Search
            size={17}
            aria-hidden="true"
            style={{ position: "absolute", left: "14px", color: "#6b7280", pointerEvents: "none" }}
          />
          <input
            type="search"
            placeholder="Search modules…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search modules"
            style={{
              width:        "320px",
              maxWidth:     "100%",
              padding:      "10px 15px 10px 42px",
              borderRadius: "12px",
              border:       "1px solid #d1d5db",
              fontSize:     "14px",
              outline:      "none",
              boxSizing:    "border-box",
            }}
          />
        </label>
      </div>

      {/* ── Right: clock, theme, notifications, profile ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>

        {/* Clock + status */}
        <div style={{ textAlign: "right" }}>
          <time style={{ fontSize: "13px", color: "#6b7280", display: "block" }}>
            {currentTime}
          </time>
          <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
            ● Online
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width:          "42px",
            height:         "42px",
            borderRadius:   "50%",
            border:         "1px solid #e5e7eb",
            background:     "#ffffff",
            cursor:         "pointer",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
        >
          {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>

        {/* Notifications */}
        {/* FIXED: was a bare <div> with no keyboard access */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setShowNotifs((v) => !v); setShowProfile(false); }}
            aria-label={`${NOTIF_COUNT} notifications`}
            aria-expanded={showNotifs}
            style={{
              border:     "none",
              background: "transparent",
              cursor:     "pointer",
              display:    "grid",
              placeItems: "center",
              position:   "relative",
              padding:    "4px",
            }}
          >
            <Bell size={22} aria-hidden="true" />
            <span
              aria-hidden="true"
              style={{
                position:       "absolute",
                top:            "-2px",
                right:          "-4px",
                background:     "#ef4444",
                color:          "#ffffff",
                width:          "18px",
                height:         "18px",
                borderRadius:   "50%",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       "11px",
                fontWeight:     700,
              }}
            >
              {NOTIF_COUNT}
            </span>
          </button>

          {showNotifs && (
            <div
              role="dialog"
              aria-label="Notifications"
              style={{
                position:     "absolute",
                top:          "48px",
                right:        0,
                width:        "280px",
                background:   "#ffffff",
                borderRadius: "15px",
                boxShadow:    "0 10px 30px rgba(0,0,0,0.12)",
                border:       "1px solid #e5e7eb",
                zIndex:       999,
                overflow:     "hidden",
              }}
            >
              <p style={{ margin: 0, padding: "16px 20px", fontWeight: 700, borderBottom: "1px solid #f3f4f6", fontSize: "14px" }}>
                Notifications
              </p>
              {["New job matched: DevOps at AWS", "ATS Score improved to 92%", "Resume viewed by recruiter"].map((n) => (
                <div key={n} style={{ padding: "14px 20px", borderBottom: "1px solid #f9fafb", fontSize: "13px", color: "#374151" }}>
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        {/* FIXED: was a bare <div onClick> — not keyboard accessible */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setShowProfile((v) => !v); setShowNotifs(false); }}
            aria-expanded={showProfile}
            aria-haspopup="menu"
            aria-label="User profile menu"
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "10px",
              cursor:     "pointer",
              border:     "none",
              background: "transparent",
              padding:    "6px 10px",
              borderRadius: "12px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width:          "40px",
                height:         "40px",
                borderRadius:   "50%",
                background:     "#2563eb",
                color:          "#ffffff",
                display:        "flex",
                justifyContent: "center",
                alignItems:     "center",
                fontWeight:     700,
                fontSize:       "17px",
                flexShrink:     0,
              }}
            >
              {userInitial}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap" }}>{userName}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>{userRole}</div>
            </div>
            <ChevronDown
              size={16}
              aria-hidden="true"
              style={{
                transition: "transform 0.2s ease",
                transform:  showProfile ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {showProfile && (
            <div
              role="menu"
              style={{
                position:     "absolute",
                top:          "60px",
                right:        0,
                width:        "240px",
                background:   "#ffffff",
                borderRadius: "15px",
                boxShadow:    "0 10px 30px rgba(0,0,0,0.12)",
                border:       "1px solid #e5e7eb",
                overflow:     "hidden",
                zIndex:       999,
              }}
            >
              {/* User info header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "14px" }}>{userName}</p>
                {/* FIXED: email is now a prop, not hardcoded */}
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>{userEmail}</p>
              </div>

              {/* Menu items — FIXED: <div onClick> → <button role="menuitem"> */}
              {[
                { icon: User,     label: "Profile",  href: "/profile"  },
                { icon: Settings, label: "Settings", href: "/settings" },
              ].map(({ icon: Icon, label, href }) => (
                <button
                  key={label}
                  role="menuitem"
                  onClick={() => { router.push(href); setShowProfile(false); }}
                  style={menuItemStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </button>
              ))}

              <button
                role="menuitem"
                onClick={logout}
                style={{ ...menuItemStyle, color: "#dc2626", borderTop: "1px solid #f3f4f6" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <LogOut size={17} aria-hidden="true" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
