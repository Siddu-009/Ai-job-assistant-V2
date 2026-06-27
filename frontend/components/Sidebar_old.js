import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Wand2,
  BadgeCheck,
  History,
  Layers3,
  BriefcaseBusiness,
  BarChart3,
  Map,
  Mail,
  UserCircle2,
  Settings,
  LogOut,
  Moon,
  SunMedium,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  
  { label: "Dashboard", href: "/", icon: LayoutDashboard },

  { label: "Resume Upload", href: "/upload", icon: Upload },

  { label: "ATS Analyzer", href: "/ats", icon: BadgeCheck },

  { label: "Resume Builder", href: "/resume-builder", icon: FileText },

  { label: "Resume History", href: "/resume-history", icon: History },

  { label: "Resume Versions", href: "/resume-versions", icon: Layers3 },

  { label: "Career Roadmap", href: "/career-roadmap", icon: Map },

  { label: "Cover Letter", href: "/cover-letter", icon: Mail },

  { label: "Skill Gap", href: "/skill-gap", icon: Wand2 },

  { label: "Mock Interview", href: "/mock-interview", icon: BriefcaseBusiness },

  { label: "Job Recommendations", href: "/job-recommendations", icon: BriefcaseBusiness },

  { label: "Applications", href: "/applications", icon: BriefcaseBusiness },

  { label: "Activity", href: "/activity", icon: History },

  { label: "Analytics", href: "/analytics", icon: BarChart3 },

  { label: "Workflow", href: "/application-workflow", icon: Layers3 },

  { label: "Profile", href: "/profile", icon: UserCircle2 },

  { label: "Settings", href: "/settings", icon: Settings },

  { label: "Admin", href: "/admin", icon: LayoutDashboard },

  { label: "Recruiter", href: "/recruiter-dashboard", icon: UserCircle2 }
];

// ─── colour tokens ────────────────────────────────────────────────────────────
const THEME = {
  dark: {
    bg:       "#020617",
    card:     "#0f172a",
    muted:    "#94a3b8",
    activeBg: "#1d4ed8",
    hoverBg:  "#1e293b",
  },
  light: {
    bg:       "#0f172a",
    card:     "#111827",
    muted:    "#cbd5e1",
    activeBg: "#2563eb",
    hoverBg:  "#1f2937",
  },
};

// ─── style builders ───────────────────────────────────────────────────────────
function buildStyles(collapsed, darkMode) {
  const t = darkMode ? THEME.dark : THEME.light;

  return {
    sidebar: {
      width:        collapsed ? "84px" : "280px",
      minHeight:    "100vh",
      background:   t.bg,
      color:        "#ffffff",
      padding:      "18px 14px",
      display:      "flex",
      flexDirection: "column",
      transition:   "width 0.25s ease",
      borderRight:  "1px solid rgba(255,255,255,0.08)",
      position:     "sticky",
      top:          0,
      boxSizing:    "border-box",
    },

    brand: {
      display:        "flex",
      alignItems:     "center",
      justifyContent: collapsed ? "center" : "space-between",
      gap:            "12px",
      padding:        "10px 8px 18px",
    },

    brandTitle: {
      display:      collapsed ? "none" : "block",
      fontSize:     "18px",
      fontWeight:   800,
      letterSpacing: "0.2px",
      lineHeight:   1.1,
    },

    brandSub: {
      display:   collapsed ? "none" : "block",
      fontSize:  "12px",
      color:     t.muted,
      marginTop: "4px",
    },

    collapseBtn: {
      width:        "36px",
      height:       "36px",
      borderRadius: "12px",
      border:       "1px solid rgba(255,255,255,0.08)",
      background:   t.card,
      color:        "#ffffff",
      display:      "grid",
      placeItems:   "center",
      cursor:       "pointer",
      flexShrink:   0,
    },

    nav: {
      display:       "flex",
      flexDirection: "column",
      gap:           "4px",
      marginTop:     "10px",
      flex:          1,
      overflowY:     "auto",
      paddingRight:  "4px",
    },

    navItem: (active) => ({
      display:     "flex",
      alignItems:  "center",
      gap:         "12px",
      width:       "100%",
      border:      "none",
      outline:     "none",
      cursor:      "pointer",
      borderRadius: "14px",
      padding:     collapsed ? "12px" : "12px 14px",
      background:  active ? t.activeBg : "transparent",
      color:       "#ffffff",
      textAlign:   "left",
      transition:  "background 0.15s ease",
      boxShadow:   active ? "0 10px 20px rgba(37,99,235,0.22)" : "none",
      justifyContent: collapsed ? "center" : "flex-start",
    }),

    itemLabel: {
      display:    collapsed ? "none" : "block",
      fontSize:   "14px",
      fontWeight: 600,
      whiteSpace: "nowrap",
    },

    footer: {
      marginTop:     "16px",
      display:       "flex",
      flexDirection: "column",
      gap:           "10px",
    },

    themeBtn: {
      display:        "flex",
      alignItems:     "center",
      justifyContent: collapsed ? "center" : "flex-start",
      gap:            "12px",
      width:          "100%",
      padding:        collapsed ? "12px" : "12px 14px",
      borderRadius:   "14px",
      border:         "1px solid rgba(255,255,255,0.08)",
      background:     t.card,
      color:          "#ffffff",
      cursor:         "pointer",
      fontSize:       "14px",
      fontWeight:     600,
    },

    logoutBtn: {
      display:        "flex",
      alignItems:     "center",
      justifyContent: collapsed ? "center" : "flex-start",
      gap:            "12px",
      width:          "100%",
      padding:        collapsed ? "12px" : "12px 14px",
      borderRadius:   "14px",
      border:         "none",
      background:     "#dc2626",
      color:          "#ffffff",
      cursor:         "pointer",
      fontWeight:     700,
      fontSize:       "14px",
    },

    userBox: {
      display:      collapsed ? "none" : "block",
      borderTop:    "1px solid rgba(255,255,255,0.08)",
      paddingTop:   "14px",
      marginTop:    "10px",
    },

    userName: {
      fontSize:   "14px",
      fontWeight: 700,
    },

    userRole: {
      fontSize:  "12px",
      color:     t.muted,
      marginTop: "4px",
    },

    hint: {
      fontSize:  "12px",
      color:     t.muted,
      marginTop: "8px",
      lineHeight: 1.5,
    },
  };
}

// ─── component ────────────────────────────────────────────────────────────────
export default function Sidebar({ onLogout, userName = "Siddardha Maddula", userRole = "DevOps / Cloud Engineering" }) {
  const router  = useRouter();
  const [mounted,   setMounted]   = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode,  setDarkMode]  = useState(false);

  // Hydrate from localStorage once mounted (avoids SSR mismatch)
  useEffect(() => {
    const theme          = localStorage.getItem("theme");
    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    setDarkMode(theme === "dark");
    setCollapsed(savedCollapsed === "true");
    setMounted(true);
  }, []);

  // Persist collapsed state
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed, mounted]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const toggleCollapsed = () => setCollapsed((v) => !v);

  // Don't render until client-side values are loaded (prevents flash)
  if (!mounted) return null;

  const s = buildStyles(collapsed, darkMode);

  return (
    <aside style={s.sidebar} aria-label="Main navigation">
      {/* ── Brand ── */}
      <div style={s.brand}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            aria-hidden="true"
            style={{
              width:        "42px",
              height:       "42px",
              borderRadius: "14px",
              display:      "grid",
              placeItems:   "center",
              background:   "linear-gradient(135deg, #2563eb, #7c3aed)",
              boxShadow:    "0 12px 24px rgba(37,99,235,0.25)",
              fontWeight:   900,
              flexShrink:   0,
            }}
          >
            AI
          </div>
          {!collapsed && (
            <div>
              <div style={s.brandTitle}>AI Job Assistant</div>
              <div style={s.brandSub}>Smart resume and career platform</div>
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapsed}
          style={s.collapseBtn}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ── Nav ── */}
      <nav style={s.nav}>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active =
            router.pathname === href ||
            (href !== "/" && router.pathname.startsWith(href));

          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              style={s.navItem(active)}
              aria-current={active ? "page" : undefined}
              title={collapsed ? label : undefined}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={19} strokeWidth={2.2} aria-hidden="true" />
              <span style={s.itemLabel}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div style={s.footer}>
        <button
          onClick={toggleTheme}
          style={s.themeBtn}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode
            ? <SunMedium size={18} aria-hidden="true" />
            : <Moon      size={18} aria-hidden="true" />
          }
          {!collapsed && (
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>

        <button
          onClick={onLogout}
          style={s.logoutBtn}
          title="Logout"
        >
          <LogOut size={18} aria-hidden="true" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* User info — pass userName/userRole as props for flexibility */}
        <div style={s.userBox}>
          <div style={s.userName}>{userName}</div>
          <div style={s.userRole}>{userRole}</div>
          <div style={s.hint}>
            Use the sidebar to switch between dashboard modules and AI tools.
          </div>
        </div>
      </div>
    </aside>
  );
}
