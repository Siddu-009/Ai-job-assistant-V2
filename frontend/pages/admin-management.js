import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function AdminManagement() {
  const { colors, darkMode } = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/admin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to load users");
      }

      const data = await response.json();

      setUsers(data.users || data || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to delete user");
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Unable to delete user.");
    }
  };

  const blockUser = async (id) => {
    try {
      const response = await fetch("/api/admin/block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to block user");
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Unable to block user.");
    }
  };

  const thStyle = {
    padding: "15px",
    borderBottom: `2px solid ${colors.border}`,
    textAlign: "left",
    color: colors.text,
    fontSize: "14px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "15px",
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text,
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        padding: "40px 20px",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "35px",
          background: colors.card,
          border: colors.borderStyle,
          borderRadius: "20px",
          boxShadow: darkMode
            ? "0 15px 35px rgba(0, 0, 0, 0.35)"
            : "0 15px 35px rgba(0, 0, 0, 0.08)",
          transition: "background 0.3s ease, border 0.3s ease",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "32px",
            fontWeight: "700",
          }}
        >
          Admin Management
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: colors.subText,
          }}
        >
          Manage platform users and administrators.
        </p>

        {loading && (
          <p
            style={{
              marginTop: "25px",
              color: colors.subText,
            }}
          >
            Loading...
          </p>
        )}

        {!loading && (
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              marginTop: "30px",
              border: colors.borderStyle,
              borderRadius: "12px",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "850px",
                borderCollapse: "collapse",
                background: colors.card,
              }}
            >
              <thead
                style={{
                  background: colors.cardSecondary,
                }}
              >
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || index}>
                    <td style={tdStyle}>{user.name || "N/A"}</td>

                    <td style={tdStyle}>{user.email || "N/A"}</td>

                    <td style={tdStyle}>{user.role || "N/A"}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          background:
                            user.status?.toLowerCase() === "blocked"
                              ? colors.dangerBg
                              : colors.successBg,
                          color:
                            user.status?.toLowerCase() === "blocked"
                              ? colors.dangerText
                              : colors.successText,
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {user.status || "Active"}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <button
                          type="button"
                          style={{
                            padding: "10px 18px",
                            background: "#f59e0b",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                          onClick={() => blockUser(user.id)}
                        >
                          Block
                        </button>

                        <button
                          type="button"
                          style={{
                            padding: "10px 18px",
                            background: "#dc2626",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div
                style={{
                  padding: "35px",
                  textAlign: "center",
                  color: colors.subText,
                  background: colors.cardSecondary,
                }}
              >
                No users found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}