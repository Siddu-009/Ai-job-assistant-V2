import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Search,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const MODULES = [
  { name: "Dashboard", path: "/" },
  { name: "Analytics", path: "/analytics" },
  { name: "Notifications", path: "/notifications" },
  { name: "Profile", path: "/profile" },
  { name: "Settings", path: "/settings" },
  { name: "Resume Center", path: "/resume-center" },
  { name: "ATS Resume Analyzer", path: "/ats-score" },
  { name: "Saved Jobs", path: "/saved-jobs" },
  { name: "Applications", path: "/applications" },
  { name: "Recommended Jobs", path: "/recommended-jobs" },
];

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
  title,
  subtitle,
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
  const [results,     setResults]     = useState([]);
  const [notifications, setNotifications] = useState([]);

  const unreadCount =
  Array.isArray(notifications)
      ? notifications.filter(item => !item.is_read).length
      : 0;

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
    localStorage.clear();
    router.replace("/login");
  };

const searchItems = [

  // MAIN
  { title: "Dashboard", path: "/" },
  { title: "Analytics", path: "/analytics" },
  { title: "Notifications", path: "/notifications" },

  // RESUME
  { title: "Resume Upload", path: "/resume-upload" },
  { title: "Resume Builder", path: "/resume-builder" },
  { title: "Resume Enhancer", path: "/resume-enhancer" },
  { title: "Resume Tailoring", path: "/resume-tailoring" },
  { title: "Resume Compare", path: "/resume-compare" },
  { title: "Resume History", path: "/resume-history" },
  { title: "Resume Versions", path: "/resume-versions" },
  { title: "Resume Center", path: "/resume-center" },


  // AI TOOLS
  { title: "ATS Analyzer", path: "/ats-score" },
  { title: "Skill Gap", path: "/skill-gap" },
  { title: "Learning", path: "/learning" },
  { title: "Career Coach", path: "/career-coach" },
  { title: "Career Roadmap", path: "/career-roadmap" },
  { title: "Interview Questions", path: "/interview-questions" },
  { title: "Mock Test", path: "/mock-test" },
  { title: "Cover Letter", path: "/cover-letter" },

  // JOBS
  { title: "Live Jobs", path: "/live-jobs" },
  { title: "Recommendations", path: "/recommended-jobs" },
  { title: "Saved Jobs", path: "/saved-jobs" },
  { title: "Applications", path: "/applications" },
  { title: "Job Tracker", path: "/job-tracker" },
  { title: "Application Status", path: "/application-status" },
  { title: "Job Alerts", path: "/job-alerts" },
  { title: "Workflow", path: "/workflow" },

  // RECRUITER
  { title: "Recruiter Dashboard", path: "/recruiter-dashboard" },
  { title: "Candidate Search", path: "/candidate-search" },
  { title: "Recruiter Analytics", path: "/recruiter-analytics" },

  // ADMIN
  { title: "Admin Dashboard", path: "/admin-dashboard" },
  { title: "Admin Management", path: "/admin-management" },
  { title: "Downloads", path: "/downloads" },
  { title: "Profile", path: "/profile" },
  { title: "Settings", path: "/settings" }

];

const loadNotifications = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            setNotifications([]);
            return;
        }

        const response = await fetch("/api/notifications/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
            setNotifications(data.notifications || []);
        } else {
            setNotifications([]);
        }

    } catch (err) {
        console.error(err);
        setNotifications([]);
    }
};

useEffect(() => {

    loadNotifications();

    const interval = setInterval(() => {

        loadNotifications();

    }, 30000);

    return () => clearInterval(interval);

}, []);

const markAsRead = async (id) => {

    const token = localStorage.getItem("token");

    await fetch(
        `/api/notifications/${id}/read`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token
            })
        }
    );

    await loadNotifications();

};

const markAllRead = async () => {

    const token = localStorage.getItem("token");

    await fetch("/api/notifications/read-all", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    });

    await loadNotifications();
};

const clearAllNotifications = async () => {

    const token = localStorage.getItem("token");

    await fetch("/api/notifications/clear-all", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    });

    await loadNotifications();
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
          ></button>

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
            onChange={(e) => {
                const value = e.target.value;

                setSearch(value);

                if (!value.trim()) {
                    setResults([]);
                    return;
                }

                const filtered = searchItems.filter(item =>
                    item.title.toLowerCase().includes(value.toLowerCase())
                );

                setResults(filtered);
            }}
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

          {results.length > 0 && (

          <div
          style={{
              position:"absolute",
              top:"52px",
              left:0,
              width:"100%",
              background:"#fff",
              borderRadius:"10px",
              border:"1px solid #ddd",
              boxShadow:"0 10px 25px rgba(0,0,0,.15)",
              zIndex:1000
          }}
          >

          {results.map(item=>(

          <div
          key={item.path}
          onClick={()=>{
              router.push(item.path);
              setSearch("");
              setResults([]);
          }}
          style={{
              padding:"12px 18px",
              cursor:"pointer"
          }}
          onMouseEnter={(e)=>e.currentTarget.style.background="#f3f4f6"}
          onMouseLeave={(e)=>e.currentTarget.style.background="#fff"}
          >

          {item.title}

          </div>

          ))}

          </div>

          )}

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
            aria-label={`${unreadCount} notifications`}
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
              {unreadCount}
            </span>
          </button>

          {showNotifs && (
            <div
              role="dialog"
              aria-label="Notifications"
              style={{
                  position:"absolute",
                  top:"48px",
                  right:0,
                  width:"340px",
                  maxHeight:"450px",
                  overflowY:"auto",
                  overflowX:"hidden",
                  background:"#fff",
                  borderRadius:"15px",
                  boxShadow:"0 10px 30px rgba(0,0,0,.12)",
                  border:"1px solid #e5e7eb",
                  zIndex:999
              }}
            >
              <div>

              <div
              style={{
              maxHeight:"340px",
              overflowY:"auto"
              }}
              >

              </div>

              </div>
              <p style={{ margin: 0, padding: "16px 20px", fontWeight: 700, borderBottom: "1px solid #f3f4f6", fontSize: "14px" }}>
                Notifications
              </p>

              <div
              style={{
              display:"flex",
              justifyContent:"space-between",
              padding:"10px 16px",
              borderBottom:"1px solid #eee",
              background:"#fafafa"
              }}
              >

              <button
              onClick={markAllRead}
              style={{
              border:"none",
              background:"none",
              color:"#2563eb",
              cursor:"pointer",
              fontWeight:600
              }}
              >
              Mark all as read
              </button>

              <button
              onClick={clearAllNotifications}
              style={{
              border:"none",
              background:"none",
              color:"#ef4444",
              cursor:"pointer",
              fontWeight:600
              }}
              >
              Clear all
              </button>

              </div>
              {Array.isArray(notifications) &&
              notifications.map((item) => (

              <div
              key={item.id}
              onClick={async()=>{

              await markAsRead(item.id);

              setShowNotifs(false);

              if(item.link){

                console.log(item);

              router.push(item.link);

              }

              }}
              style={{
                  padding:"14px 20px",
                  cursor:"pointer",
                  borderBottom:"1px solid #f3f4f6",
                  background:item.is_read
                  ? "#ffffff"
                  : "#eff6ff"
              }}
              onMouseEnter={(e)=>e.currentTarget.style.background="#f9fafb"}
              onMouseLeave={(e)=>
              e.currentTarget.style.background=
              item.is_read
              ? "#ffffff"
              : "#eff6ff"
              }
              >

              <div style={{ fontWeight: 600 }}>
                  {item.title}
              </div>

              <div
              style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "4px"
              }}
              >
                  {item.message}
              </div>

              <div
              style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginTop: "6px"
              }}
              >
                  {item.created_at}
              </div>

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
