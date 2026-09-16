import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../context/ThemeContext";

import {
  Search,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// ============================================================================
// SEARCH MODULES
// ============================================================================

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
  { title: "Settings", path: "/settings" },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function Navbar({
  collapsed,
  setCollapsed,
  title,
  subtitle,
  userName = "Siddardha",
  userRole = "DevOps Engineer",
  userEmail = "user@example.com",
  userInitial = "S",
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const { darkMode, toggleTheme } = useTheme();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // ==========================================================================
  // THEME COLORS
  // ==========================================================================

  const theme = {
    // Navbar
    navbarBg: darkMode ? "#0f172a" : "#ffffff",

    navbarBorder: darkMode
      ? "rgba(148, 163, 184, 0.16)"
      : "rgba(15, 23, 42, 0.10)",

    navbarShadow: darkMode
      ? "0 2px 12px rgba(0,0,0,0.18)"
      : "0 2px 12px rgba(15,23,42,0.06)",

    // Main text
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",

    textSecondary: darkMode ? "#cbd5e1" : "#475569",

    textMuted: darkMode ? "#94a3b8" : "#64748b",

    // Icons
    icon: darkMode ? "#cbd5e1" : "#475569",

    iconHover: darkMode ? "#ffffff" : "#0f172a",

    // Search
    inputBg: darkMode ? "#1e293b" : "#ffffff",

    inputBorder: darkMode
      ? "rgba(148,163,184,0.22)"
      : "#d1d5db",

    inputPlaceholder: darkMode
      ? "#94a3b8"
      : "#64748b",

    inputFocus: "#2563eb",

    // Dropdown
    dropdownBg: darkMode ? "#172033" : "#ffffff",

    dropdownBorder: darkMode
      ? "rgba(148,163,184,0.20)"
      : "#e5e7eb",

    dropdownShadow: darkMode
      ? "0 15px 35px rgba(0,0,0,0.35)"
      : "0 15px 35px rgba(15,23,42,0.12)",

    dropdownHover: darkMode
      ? "#263449"
      : "#f8fafc",

    dropdownDivider: darkMode
      ? "rgba(148,163,184,0.14)"
      : "#f1f5f9",

    // Notification
    unreadBg: darkMode
      ? "rgba(37,99,235,0.18)"
      : "#eff6ff",

    readBg: darkMode
      ? "#172033"
      : "#ffffff",

    // Small controls
    controlBg: darkMode ? "#1e293b" : "#f8fafc",

    controlBorder: darkMode
      ? "rgba(148,163,184,0.20)"
      : "#e5e7eb",

    // Online
    online: "#16a34a",

    // Danger
    danger: "#dc2626",
  };

  // ==========================================================================
  // NOTIFICATION COUNT
  // ==========================================================================

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((item) => !item.is_read).length
    : 0;

  // ==========================================================================
  // CLOCK
  // ==========================================================================

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString());
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ==========================================================================

  useEffect(() => {
    const handleClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotifs(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  // ==========================================================================
  // SIDEBAR COLLAPSE
  // ==========================================================================

  const toggleCollapsed = () => {
    if (setCollapsed) {
      setCollapsed((value) => !value);
    }
  };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("theme");

    router.replace("/login");
  };

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  const handleSearch = (event) => {
    const value = event.target.value.trimStart();

    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const filtered = searchItems.filter((item) =>
      item.title
        .toLowerCase()
        .includes(value.trim().toLowerCase())
    );

    setResults(filtered);
  };

  const selectSearchResult = (path) => {
    router.push(path);

    setSearch("");
    setResults([]);
  };

  // ==========================================================================
  // LOAD NOTIFICATIONS
  // ==========================================================================

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        return;
      }

      const response = await fetch(
        "http://localhost:8000/notifications/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setNotifications([]);
        return;
      }

      if (data.success) {
        setNotifications(
          data.notifications || []
        );
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(error);

      setNotifications([]);
    }
  };

  // ==========================================================================
  // NOTIFICATION POLLING
  // ==========================================================================

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================================================
  // MARK NOTIFICATION AS READ
  // ==========================================================================

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      await fetch(
        `/api/notifications/${id}/read`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
          }),
        }
      );

      await loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================================================
  // MARK ALL READ
  // ==========================================================================

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      await fetch(
        "http://localhost:8000/notifications/read-all",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
          }),
        }
      );

      await loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================================================
  // CLEAR ALL NOTIFICATIONS
  // ==========================================================================

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      await fetch(
        "http://localhost:8000/notifications/clear-all",
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
          }),
        }
      );

      await loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================================================
  // ICON BUTTON STYLE
  // ==========================================================================

  const iconButtonStyle = {
    width: "42px",

    height: "42px",

    borderRadius: "12px",

    border:
      `1px solid ${theme.controlBorder}`,

    background:
      theme.controlBg,

    color:
      theme.icon,

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexShrink: 0,

    transition:
      "background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
  };

  // ==========================================================================
  // RETURN
  // ==========================================================================

  return (
    <header
      style={{
        height: "75px",

        width: "100%",

        background: theme.navbarBg,

        color: theme.textPrimary,

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        padding: "0 30px",

        borderBottom:
          `1px solid ${theme.navbarBorder}`,

        position: "sticky",

        top: 0,

        zIndex: 99,

        boxShadow: theme.navbarShadow,

        gap: "16px",

        boxSizing: "border-box",

        transition:
          "background 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
    >

      {/* ====================================================================
          LEFT SIDE
          ==================================================================== */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "16px",

          minWidth: 0,

          flex: 1,
        }}
      >

        {/* ================================================================
            SIDEBAR TOGGLE
            ================================================================ */}

        <button
          type="button"
          onClick={toggleCollapsed}
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
            ...iconButtonStyle,

            borderRadius: "11px",

            background: theme.controlBg,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              darkMode
                ? "#334155"
                : "#e2e8f0";

            e.currentTarget.style.color =
              theme.iconHover;

            e.currentTarget.style.transform =
              "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              theme.controlBg;

            e.currentTarget.style.color =
              theme.icon;

            e.currentTarget.style.transform =
              "scale(1)";
          }}
        >
          {collapsed ? (
            <Menu
              size={20}
              strokeWidth={2.3}
            />
          ) : (
            <X
              size={20}
              strokeWidth={2.3}
            />
          )}
        </button>

        {/* ================================================================
            SEARCH
            ================================================================ */}

        <label
          style={{
            position: "relative",

            display: "flex",

            alignItems: "center",

            minWidth: 0,

            maxWidth: "360px",

            width: "100%",
          }}
        >
          <Search
            size={18}
            aria-hidden="true"
            style={{
              position: "absolute",

              left: "14px",

              color:
                theme.textMuted,

              pointerEvents: "none",

              zIndex: 1,
            }}
          />

          <input
            type="search"
            placeholder="Search modules..."
            value={search}
            onChange={handleSearch}
            aria-label="Search modules"
            style={{
              width: "100%",

              height: "42px",

              padding:
                "10px 15px 10px 42px",

              borderRadius: "12px",

              border:
                `1px solid ${theme.inputBorder}`,

              background:
                theme.inputBg,

              color:
                theme.textPrimary,

              fontSize: "14px",

              outline: "none",

              boxSizing: "border-box",

              transition:
                "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                theme.inputFocus;

              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(37,99,235,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                theme.inputBorder;

              e.currentTarget.style.boxShadow =
                "none";
            }}
          />

          {/* ==============================================================
              SEARCH RESULTS
              ============================================================== */}

          {results.length > 0 && (
            <div
              style={{
                position: "absolute",

                top: "50px",

                left: 0,

                width: "100%",

                maxHeight: "350px",

                overflowY: "auto",

                background:
                  theme.dropdownBg,

                border:
                  `1px solid ${theme.dropdownBorder}`,

                borderRadius: "13px",

                boxShadow:
                  theme.dropdownShadow,

                zIndex: 1000,

                padding: "6px",
              }}
            >
              {results.map((item) => (
                <button
                  type="button"
                  key={item.path}
                  onClick={() =>
                    selectSearchResult(
                      item.path
                    )
                  }
                  style={{
                    width: "100%",

                    padding:
                      "11px 13px",

                    border: "none",

                    borderRadius: "8px",

                    background:
                      "transparent",

                    color:
                      theme.textPrimary,

                    cursor: "pointer",

                    textAlign: "left",

                    fontSize: "14px",

                    transition:
                      "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      theme.dropdownHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "transparent";
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </label>

        {/* Optional page title */}

        {(title || subtitle) && (
          <div
            style={{
              minWidth: 0,

              display: "none",
            }}
          >
            {title && (
              <div
                style={{
                  color:
                    theme.textPrimary,

                  fontWeight: 700,
                }}
              >
                {title}
              </div>
            )}

            {subtitle && (
              <div
                style={{
                  color:
                    theme.textMuted,

                  fontSize: "12px",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          RIGHT SIDE
          ==================================================================== */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "12px",

          flexShrink: 0,
        }}
      >

        {/* ================================================================
            CLOCK
            ================================================================ */}

        <div
          style={{
            textAlign: "right",

            lineHeight: 1.2,
          }}
        >
          <time
            style={{
              fontSize: "12px",

              color:
                theme.textMuted,

              display: "block",

              whiteSpace: "nowrap",
            }}
          >
            {currentTime}
          </time>

          <span
            style={{
              fontSize: "11px",

              color:
                theme.online,

              fontWeight: 600,

              display: "block",

              marginTop: "4px",
            }}
          >
            ● Online
          </span>
        </div>

        {/* ================================================================
            THEME TOGGLE
            ================================================================ */}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          style={iconButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              darkMode
                ? "#334155"
                : "#e2e8f0";

            e.currentTarget.style.color =
              darkMode
                ? "#facc15"
                : "#2563eb";

            e.currentTarget.style.transform =
              "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              theme.controlBg;

            e.currentTarget.style.color =
              theme.icon;

            e.currentTarget.style.transform =
              "scale(1)";
          }}
        >
          {darkMode ? (
            <Sun
              size={19}
              strokeWidth={2.2}
            />
          ) : (
            <Moon
              size={19}
              strokeWidth={2.2}
            />
          )}
        </button>

        {/* ================================================================
            NOTIFICATIONS
            ================================================================ */}

        <div
          ref={notifRef}
          style={{
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setShowNotifs(
                (value) => !value
              );

              setShowProfile(false);
            }}
            aria-label={`${unreadCount} notifications`}
            aria-expanded={showNotifs}
            style={iconButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                darkMode
                  ? "#334155"
                  : "#e2e8f0";

              e.currentTarget.style.color =
                theme.iconHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                theme.controlBg;

              e.currentTarget.style.color =
                theme.icon;
            }}
          >
            <Bell
              size={20}
              strokeWidth={2.2}
            />

            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",

                  top: "-4px",

                  right: "-4px",

                  minWidth: "18px",

                  height: "18px",

                  padding: "0 4px",

                  borderRadius: "999px",

                  background: "#ef4444",

                  color: "#ffffff",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  fontSize: "10px",

                  fontWeight: 700,

                  border:
                    `2px solid ${theme.navbarBg}`,

                  boxSizing:
                    "border-box",
                }}
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* ==============================================================
              NOTIFICATION DROPDOWN
              ============================================================== */}

          {showNotifs && (
            <div
              role="dialog"
              aria-label="Notifications"
              style={{
                position: "absolute",

                top: "52px",

                right: 0,

                width: "360px",

                maxWidth:
                  "calc(100vw - 30px)",

                maxHeight: "480px",

                overflow: "hidden",

                background:
                  theme.dropdownBg,

                color:
                  theme.textPrimary,

                border:
                  `1px solid ${theme.dropdownBorder}`,

                borderRadius: "15px",

                boxShadow:
                  theme.dropdownShadow,

                zIndex: 999,

                boxSizing: "border-box",
              }}
            >
              {/* Header */}

              <div
                style={{
                  padding:
                    "15px 18px",

                  borderBottom:
                    `1px solid ${theme.dropdownDivider}`,

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "space-between",

                  gap: "10px",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,

                    fontSize: "15px",

                    color:
                      theme.textPrimary,
                  }}
                >
                  Notifications
                </div>

                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: "11px",

                      fontWeight: 700,

                      color: "#2563eb",

                      background:
                        theme.unreadBg,

                      padding:
                        "4px 8px",

                      borderRadius:
                        "999px",
                    }}
                  >
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {/* Actions */}

              <div
                style={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems: "center",

                  padding:
                    "9px 16px",

                  borderBottom:
                    `1px solid ${theme.dropdownDivider}`,

                  background:
                    darkMode
                      ? "#1b293d"
                      : "#f8fafc",
                }}
              >
                <button
                  type="button"
                  onClick={markAllRead}
                  style={{
                    border: "none",

                    background:
                      "transparent",

                    color:
                      "#2563eb",

                    cursor: "pointer",

                    fontWeight: 600,

                    fontSize: "12px",

                    padding: "5px 0",
                  }}
                >
                  Mark all as read
                </button>

                <button
                  type="button"
                  onClick={
                    clearAllNotifications
                  }
                  style={{
                    border: "none",

                    background:
                      "transparent",

                    color:
                      "#ef4444",

                    cursor: "pointer",

                    fontWeight: 600,

                    fontSize: "12px",

                    padding: "5px 0",
                  }}
                >
                  Clear all
                </button>
              </div>

              {/* Notification List */}

              <div
                style={{
                  maxHeight: "350px",

                  overflowY: "auto",
                }}
              >
                {Array.isArray(
                  notifications
                ) &&
                  notifications.map(
                    (item) => (
                      <div
                        key={item.id}
                        onClick={async () => {
                          await markAsRead(
                            item.id
                          );

                          setShowNotifs(
                            false
                          );

                          if (item.link) {
                            router.push(
                              item.link
                            );
                          }
                        }}
                        style={{
                          padding:
                            "14px 18px",

                          cursor:
                            "pointer",

                          borderBottom:
                            `1px solid ${theme.dropdownDivider}`,

                          background:
                            item.is_read
                              ? theme.readBg
                              : theme.unreadBg,

                          transition:
                            "background 0.15s ease",
                        }}
                        onMouseEnter={(
                          e
                        ) => {
                          e.currentTarget.style.background =
                            theme.dropdownHover;
                        }}
                        onMouseLeave={(
                          e
                        ) => {
                          e.currentTarget.style.background =
                            item.is_read
                              ? theme.readBg
                              : theme.unreadBg;
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,

                            fontSize: "14px",

                            color:
                              theme.textPrimary,
                          }}
                        >
                          {item.title}
                        </div>

                        <div
                          style={{
                            fontSize: "13px",

                            color:
                              theme.textSecondary,

                            marginTop: "5px",

                            lineHeight: 1.4,
                          }}
                        >
                          {item.message}
                        </div>

                        <div
                          style={{
                            fontSize: "11px",

                            color:
                              theme.textMuted,

                            marginTop: "7px",
                          }}
                        >
                          {item.created_at}
                        </div>
                      </div>
                    )
                  )}

                {/* Empty state */}

                {notifications.length ===
                  0 && (
                  <div
                    style={{
                      padding:
                        "30px 20px",

                      textAlign:
                        "center",

                      color:
                        theme.textMuted,

                      fontSize: "13px",
                    }}
                  >
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================
            PROFILE
            ================================================================ */}

        <div
          ref={profileRef}
          style={{
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setShowProfile(
                (value) => !value
              );

              setShowNotifs(false);
            }}
            aria-expanded={showProfile}
            aria-haspopup="menu"
            aria-label="User profile menu"
            style={{
              display: "flex",

              alignItems: "center",

              gap: "9px",

              cursor: "pointer",

              border:
                "1px solid transparent",

              background:
                "transparent",

              padding: "4px 6px",

              borderRadius: "12px",

              color:
                theme.textPrimary,

              transition:
                "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                theme.dropdownHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";
            }}
          >
            {/* Avatar */}

            <div
              aria-hidden="true"
              style={{
                width: "40px",

                height: "40px",

                borderRadius: "50%",

                background:
                  "#2563eb",

                color: "#ffffff",

                display: "flex",

                justifyContent:
                  "center",

                alignItems: "center",

                fontWeight: 700,

                fontSize: "16px",

                flexShrink: 0,

                boxShadow:
                  "0 3px 10px rgba(37,99,235,0.25)",
              }}
            >
              {userInitial}
            </div>

            {/* User information */}

            <div
              style={{
                textAlign: "left",

                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 600,

                  fontSize: "14px",

                  color:
                    theme.textPrimary,

                  whiteSpace:
                    "nowrap",

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  maxWidth: "130px",
                }}
              >
                {userName}
              </div>

              <div
                style={{
                  fontSize: "12px",

                  color:
                    theme.textMuted,

                  whiteSpace:
                    "nowrap",

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  maxWidth: "130px",

                  marginTop: "2px",
                }}
              >
                {userRole}
              </div>
            </div>

            <ChevronDown
              size={16}
              aria-hidden="true"
              style={{
                color:
                  theme.icon,

                flexShrink: 0,

                transition:
                  "transform 0.2s ease",

                transform:
                  showProfile
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
              }}
            />
          </button>

          {/* ==============================================================
              PROFILE DROPDOWN
              ============================================================== */}

          {showProfile && (
            <div
              role="menu"
              style={{
                position: "absolute",

                top: "54px",

                right: 0,

                width: "250px",

                background:
                  theme.dropdownBg,

                color:
                  theme.textPrimary,

                border:
                  `1px solid ${theme.dropdownBorder}`,

                borderRadius: "15px",

                boxShadow:
                  theme.dropdownShadow,

                overflow: "hidden",

                zIndex: 999,
              }}
            >
              {/* User info */}

              <div
                style={{
                  padding:
                    "16px 18px",

                  borderBottom:
                    `1px solid ${theme.dropdownDivider}`,
                }}
              >
                <p
                  style={{
                    margin: 0,

                    fontWeight: 700,

                    fontSize: "14px",

                    color:
                      theme.textPrimary,
                  }}
                >
                  {userName}
                </p>

                <p
                  style={{
                    margin:
                      "5px 0 0",

                    color:
                      theme.textMuted,

                    fontSize: "12px",

                    wordBreak:
                      "break-word",
                  }}
                >
                  {userEmail}
                </p>
              </div>

              {/* Profile */}

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  router.push(
                    "/profile"
                  );

                  setShowProfile(false);
                }}
                style={{
                  width: "100%",

                  display: "flex",

                  alignItems: "center",

                  gap: "12px",

                  padding:
                    "12px 18px",

                  border: "none",

                  background:
                    "transparent",

                  color:
                    theme.textPrimary,

                  cursor: "pointer",

                  textAlign: "left",

                  fontSize: "14px",

                  transition:
                    "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    theme.dropdownHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                <User
                  size={17}
                  color={theme.icon}
                />

                Profile
              </button>

              {/* Settings */}

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  router.push(
                    "/settings"
                  );

                  setShowProfile(false);
                }}
                style={{
                  width: "100%",

                  display: "flex",

                  alignItems: "center",

                  gap: "12px",

                  padding:
                    "12px 18px",

                  border: "none",

                  background:
                    "transparent",

                  color:
                    theme.textPrimary,

                  cursor: "pointer",

                  textAlign: "left",

                  fontSize: "14px",

                  transition:
                    "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    theme.dropdownHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                <Settings
                  size={17}
                  color={theme.icon}
                />

                Settings
              </button>

              {/* Logout */}

              <button
                type="button"
                role="menuitem"
                onClick={logout}
                style={{
                  width: "100%",

                  display: "flex",

                  alignItems: "center",

                  gap: "12px",

                  padding:
                    "12px 18px",

                  border: "none",

                  borderTop:
                    `1px solid ${theme.dropdownDivider}`,

                  background:
                    "transparent",

                  color:
                    theme.danger,

                  cursor: "pointer",

                  textAlign: "left",

                  fontSize: "14px",

                  fontWeight: 600,

                  transition:
                    "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    darkMode
                      ? "rgba(220,38,38,0.12)"
                      : "#fef2f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                <LogOut
                  size={17}
                  color={theme.danger}
                />

                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}