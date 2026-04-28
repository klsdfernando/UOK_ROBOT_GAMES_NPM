"use client";

import { useState, useEffect } from "react";

const ADMIN_SECRET = "uok-cyber-circuit-admin-x9k4m7";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEvent, setFilterEvent] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === ADMIN_SECRET) {
      setAuthenticated(true);
      fetchTeams();
    } else {
      alert("Invalid passkey.");
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/teams", {
        headers: { "x-admin-secret": ADMIN_SECRET },
      });
      const data = await res.json();
      if (data.success) setTeams(data.teams);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export", {
        headers: { "x-admin-secret": ADMIN_SECRET },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `UOK_Robot_Games_Teams_${Date.now()}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const filtered = teams.filter((t) => {
    const matchesSearch =
      !search ||
      t.teamName?.toLowerCase().includes(search.toLowerCase()) ||
      t.leaderName?.toLowerCase().includes(search.toLowerCase()) ||
      t.leaderEmail?.toLowerCase().includes(search.toLowerCase()) ||
      t.organizationName?.toLowerCase().includes(search.toLowerCase());
    const matchesEvent =
      !filterEvent || t.eventSelection === filterEvent;
    return matchesSearch && matchesEvent;
  });

  const totalTeams = teams.length;
  const battleTeams = teams.filter((t) => t.eventSelection === "Robot Battles").length;
  const raceTeams = teams.filter((t) => t.eventSelection === "Robot Race").length;
  const totalMembers = teams.reduce((s, t) => s + (t.memberCount || 0), 0);
  const completedTeams = teams.filter((t) => t.phase4Completed).length;

  // Login screen
  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 400, padding: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#004491", marginBottom: 12, display: "block" }}>admin_panel_settings</span>
            <h1 style={{ color: "white", fontSize: 20, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Admin Access</h1>
            <p style={{ color: "#71717a", fontSize: 11, marginTop: 6, letterSpacing: "0.15em", textTransform: "uppercase" }}>Enter passkey to continue</p>
          </div>
          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Enter admin passkey"
            style={{ width: "100%", background: "#0b0c16", border: "1px solid #27272a", color: "#e4e4e7", fontSize: 14, padding: "14px 16px", outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "inherit", borderRadius: 10 }}
          />
          <button type="submit" style={{ width: "100%", background: "#004491", color: "white", border: "1px solid #004491", padding: "12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}>
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  // Dashboard
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e4e4e7", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32, borderBottom: "1px solid #18181b", paddingBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="material-symbols-outlined" style={{ color: "#004491", fontSize: 24 }}>admin_panel_settings</span>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Dashboard</h1>
            </div>
            <p style={{ color: "#52525b", fontSize: 11, marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              UOK Cyber Circuit Arena · Team Management
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={fetchTeams} style={{ background: "#0b0c16", border: "1px solid #27272a", color: "#a1a1aa", padding: "8px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit", borderRadius: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span> Refresh
            </button>
            <button onClick={handleExport} disabled={exporting || teams.length === 0} style={{ background: "#004491", border: "1px solid #004491", color: "white", padding: "8px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: exporting ? 0.5 : 1, fontFamily: "inherit", borderRadius: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Teams", value: totalTeams, icon: "groups", color: "#004491" },
            { label: "Robot Battles", value: battleTeams, icon: "smart_toy", color: "#ef4444" },
            { label: "Robot Race", value: raceTeams, icon: "directions_car", color: "#00d2ff" },
            { label: "Total Members", value: totalMembers, icon: "person", color: "#10b981" },
            { label: "Paid Teams", value: completedTeams, icon: "paid", color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0b0c16", border: "1px solid #18181b", padding: "16px 20px", position: "relative", overflow: "hidden", borderRadius: 12 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
              <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 20, marginBottom: 8, display: "block" }}>{s.icon}</span>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "white" }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search teams, leaders, emails, organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, background: "#0b0c16", border: "1px solid #27272a", color: "#e4e4e7", fontSize: 13, padding: "10px 14px", outline: "none", fontFamily: "inherit", borderRadius: 10 }}
          />
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            style={{ background: "#0b0c16", border: "1px solid #27272a", color: "#a1a1aa", fontSize: 12, padding: "10px 14px", outline: "none", cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}
          >
            <option value="">All Events</option>
            <option value="Robot Battles">Robot Battles</option>
            <option value="Robot Race">Robot Race</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: 24, height: 24, border: "2px solid #27272a", borderTopColor: "#004491", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <p style={{ color: "#52525b", fontSize: 11, marginTop: 12, letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading teams...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#52525b" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12, display: "block" }}>search_off</span>
            <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>No teams found</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ background: "#0b0c16", border: "1px solid #18181b", overflow: "hidden", borderRadius: 12 }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #27272a" }}>
                    {["#", "Event", "Team Name", "Leader", "Organization", "Members", "Payment", "Progress", "Date"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTeam(t)}
                      style={{ borderBottom: "1px solid #18181b", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#111218")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "10px 14px", color: "#52525b", fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: t.eventSelection === "Robot Battles" ? "#ef4444/15" : "#00d2ff15", color: t.eventSelection === "Robot Battles" ? "#ef4444" : "#00d2ff", border: `1px solid ${t.eventSelection === "Robot Battles" ? "#ef444430" : "#00d2ff30"}` }}>
                          {t.eventSelection}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>{t.teamName}</td>
                      <td style={{ padding: "10px 14px", color: "#a1a1aa", whiteSpace: "nowrap" }}>{t.leaderName}</td>
                      <td style={{ padding: "10px 14px", color: "#71717a", whiteSpace: "nowrap" }}>{t.organizationName}</td>
                      <td style={{ padding: "10px 14px", color: "#a1a1aa", textAlign: "center" }}>{t.memberCount || "—"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        {t.phase4Completed ? (
                          <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span> Paid
                          </span>
                        ) : (
                          <span style={{ color: "#52525b", fontSize: 10 }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 3 }}>
                          {[t.phase1Completed, t.phase2Completed, t.phase3Completed, t.phase4Completed].map((c, j) => (
                            <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: c ? "#10b981" : "#27272a" }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#52525b", whiteSpace: "nowrap", fontSize: 11 }}>
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-LK", { day: "2-digit", month: "short" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedTeam && (
          <div
            onClick={() => setSelectedTeam(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#0b0c16", border: "1px solid #27272a", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", borderRadius: 16 }}>
              {/* Modal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #18181b" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>{selectedTeam.teamName}</h2>
                  <p style={{ margin: 0, fontSize: 10, color: "#52525b", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>Team Details</p>
                </div>
                <button onClick={() => setSelectedTeam(null)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
              </div>

              <div style={{ padding: "20px" }}>
                {/* Event Info */}
                <DetailSection icon="smart_toy" title="Event Information">
                  <DetailGrid>
                    <DetailItem label="Event" value={selectedTeam.eventSelection} highlight />
                    {selectedTeam.categorySelection !== "—" && <DetailItem label="Category" value={selectedTeam.categorySelection} />}
                    <DetailItem label="Team Type" value={selectedTeam.teamType} />
                    <DetailItem label="Members" value={selectedTeam.memberCount || "—"} />
                  </DetailGrid>
                </DetailSection>

                {/* Leader */}
                <DetailSection icon="person" title="Team Leader">
                  <DetailGrid>
                    <DetailItem label="Full Name" value={selectedTeam.leaderName} />
                    <DetailItem label="Email" value={selectedTeam.leaderEmail} />
                  </DetailGrid>
                </DetailSection>

                {/* Members */}
                {selectedTeam.members && selectedTeam.members.length > 0 && (
                  <DetailSection icon="groups" title="Team Members">
                    {selectedTeam.members.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < selectedTeam.members.length - 1 ? "1px solid #18181b" : "none" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#004491/15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#004491", border: "1px solid #00449130", flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>{m.fullName}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#71717a" }}>{m.contactNumber}</p>
                        </div>
                        {i === 0 && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 6px", background: "#00449115", color: "#5b9aff", border: "1px solid #00449130" }}>Leader</span>}
                      </div>
                    ))}
                  </DetailSection>
                )}

                {/* Organization */}
                <DetailSection icon="apartment" title="Organization">
                  <DetailGrid>
                    <DetailItem label="Organization" value={selectedTeam.organizationName} full />
                  </DetailGrid>
                </DetailSection>

                {/* Payment */}
                <DetailSection icon="receipt_long" title="Payment" noBorder>
                  <DetailGrid>
                    <DetailItem label="Reference Number" value={selectedTeam.referenceNumber} highlight={selectedTeam.referenceNumber !== "—"} />
                    <DetailItem label="Payment File" value={selectedTeam.paymentFileName || "Not uploaded"} />
                  </DetailGrid>
                  {selectedTeam.driveViewUrl && (
                    <div style={{ marginTop: 12 }}>
                      {selectedTeam.driveThumbnailUrl && (
                        <div style={{ border: "1px solid #27272a", overflow: "hidden", marginBottom: 10 }}>
                          <img src={selectedTeam.driveThumbnailUrl} alt="Payment Slip" style={{ maxWidth: "100%", height: "auto", display: "block" }} />
                        </div>
                      )}
                      <a
                        href={selectedTeam.driveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 14px", background: "#00449115", color: "#5b9aff", border: "1px solid #00449130", textDecoration: "none", cursor: "pointer" }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                        View on Google Drive
                      </a>
                    </div>
                  )}
                </DetailSection>

                {/* Phase Progress */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #18181b" }}>
                  <p style={{ fontSize: 9, color: "#52525b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10, margin: 0 }}>Phase Progress</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Event", "Members", "Organization", "Payment"].map((label, j) => {
                      const completed = [selectedTeam.phase1Completed, selectedTeam.phase2Completed, selectedTeam.phase3Completed, selectedTeam.phase4Completed][j];
                      return (
                        <span key={j} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", background: completed ? "#10b98115" : "#27272a30", color: completed ? "#10b981" : "#52525b", border: `1px solid ${completed ? "#10b98130" : "#27272a"}` }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{completed ? "check_circle" : "radio_button_unchecked"}</span>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Helper Components */
function DetailSection({ icon, title, children, noBorder }) {
  return (
    <div style={{ paddingBottom: noBorder ? 0 : 16, marginBottom: noBorder ? 0 : 16, borderBottom: noBorder ? "none" : "1px solid #18181b" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#004491" }}>{icon}</span>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#71717a" }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function DetailGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>{children}</div>;
}

function DetailItem({ label, value, highlight, full }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      <p style={{ margin: 0, fontSize: 9, color: "#52525b", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: highlight ? "#00d2ff" : "#e4e4e7" }}>{value}</p>
    </div>
  );
}
