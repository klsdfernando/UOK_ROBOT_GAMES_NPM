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
  const [activeTab, setActiveTab] = useState("teams");

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

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #18181b', overflowX: 'auto' }}>
          {[
            { id: 'teams', label: 'Teams', icon: 'groups' },
            { id: 'tshirts', label: 'T-Shirt Orders', icon: 'apparel' },
            { id: 'announcements', label: 'Announcements', icon: 'campaign' },
            { id: 'subscribers', label: 'Subscribers', icon: 'mail' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '10px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
              background: activeTab === tab.id ? '#0b0c16' : 'transparent',
              color: activeTab === tab.id ? '#5b9aff' : '#52525b',
              border: activeTab === tab.id ? '1px solid #27272a' : '1px solid transparent',
              borderBottom: activeTab === tab.id ? '1px solid #0b0c16' : '1px solid transparent',
              borderRadius: '10px 10px 0 0', marginBottom: -1, whiteSpace: 'nowrap',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 6 }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tshirts' && (
          <TshirtOrdersManager ADMIN_SECRET={ADMIN_SECRET} />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsManager />
        )}

        {activeTab === 'subscribers' && (
          <SubscribersManager />
        )}

        {activeTab === 'teams' && (<>
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
                      {(() => {
                        // Extract file ID from the drive view URL
                        const match = selectedTeam.driveViewUrl?.match(/\/d\/([^/]+)/);
                        const fileId = match?.[1] || (selectedTeam.driveThumbnailUrl?.match(/[?&]id=([^&]+)/)?.[1]);
                        if (fileId) {
                          return (
                            <div style={{ border: "1px solid #27272a", overflow: "hidden", marginBottom: 10, borderRadius: 8, background: "#111" }}>
                              <img
                                src={`https://lh3.googleusercontent.com/d/${fileId}=w600`}
                                alt="Payment Slip"
                                style={{ maxWidth: "100%", height: "auto", display: "block", maxHeight: 300, objectFit: "contain", margin: "0 auto" }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.style.display = 'none';
                                }}
                              />
                            </div>
                          );
                        }
                        return null;
                      })()}
                      <a
                        href={selectedTeam.driveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 14px", background: "#00449115", color: "#5b9aff", border: "1px solid #00449130", textDecoration: "none", cursor: "pointer", borderRadius: 8 }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                        View on Google Drive
                      </a>
                    </div>
                  )}
                </DetailSection>

                {/* Team T-Shirt Orders */}
                <TeamTshirtOrdersDetail teamId={selectedTeam.id} />

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
        </>)}
      </div>
    </div>
  );
}

/* ==================== Announcements Manager ==================== */
function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', tag: 'EVENT UPDATE', excerpt: '', content: '', imageUrl: '', date: '' });

  const ADMIN_SECRET = "uok-cyber-circuit-admin-x9k4m7";

  const fetchAnnouncements = async () => {
    setAnnouncementLoading(true);
    try {
      const res = await fetch('/api/admin/announcements', { headers: { 'x-admin-secret': ADMIN_SECRET } });
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements);
    } catch (err) { console.error(err); }
    finally { setAnnouncementLoading(false); }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/admin/announcements', { headers: { 'x-admin-secret': ADMIN_SECRET } });
        const data = await res.json();
        if (active && data.success) setAnnouncements(data.announcements);
      } catch (err) { console.error(err); }
      finally { if (active) setAnnouncementLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: '', tag: 'EVENT UPDATE', excerpt: '', content: '', imageUrl: '', date: '' });
    setShowForm(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ title: a.title, tag: a.tag, excerpt: a.excerpt, content: a.content, imageUrl: a.imageUrl, date: a.date || a.createdAt || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.excerpt || !form.content || !form.imageUrl) { alert('All fields are required.'); return; }
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch('/api/admin/announcements', {
        method, headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setShowForm(false); fetchAnnouncements(); }
      else alert(data.message || 'Error saving.');
    } catch (err) { console.error(err); alert('Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchAnnouncements();
    } catch (err) { console.error(err); }
  };

  const tagOptions = ['REGISTRATION', 'EVENT UPDATE', 'PARTNERSHIP', 'RESULTS', 'GENERAL'];

  const inputStyle = { width: '100%', background: '#0b0c16', border: '1px solid #27272a', color: '#e4e4e7', fontSize: 13, padding: '10px 14px', outline: 'none', fontFamily: 'inherit', borderRadius: 10, boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#71717a', marginBottom: 6 };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'white' }}>{announcements.length} <span style={{ fontSize: 14, color: '#52525b', fontWeight: 600 }}>/ 3</span></p>
          <p style={{ margin: 0, fontSize: 9, color: '#52525b', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Announcements</p>
        </div>
        <button onClick={openAdd} disabled={announcements.length >= 3} style={{ background: '#004491', border: '1px solid #004491', color: 'white', padding: '10px 18px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: announcements.length >= 3 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', borderRadius: 10, opacity: announcements.length >= 3 ? 0.4 : 1 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
          Add New
        </button>
      </div>

      {/* Loading */}
      {announcementLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 24, height: 24, border: '2px solid #27272a', borderTopColor: '#004491', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p style={{ color: '#52525b', fontSize: 11, marginTop: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty */}
      {!announcementLoading && announcements.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#52525b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12, display: 'block' }}>campaign</span>
          <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>No announcements yet</p>
        </div>
      )}

      {/* Cards */}
      {!announcementLoading && announcements.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {announcements.map((a) => (
            <div key={a.id} style={{ background: '#0b0c16', border: '1px solid #18181b', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#004491' }} />
              {a.imageUrl && (
                <div style={{ width: '100%', height: 160, background: '#111', overflow: 'hidden' }}>
                  <img src={a.imageUrl} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: 16 }}>
                <span style={{ display: 'inline-block', padding: '3px 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#00449115', color: '#5b9aff', border: '1px solid #00449130', borderRadius: 6, marginBottom: 8 }}>
                  {a.tag}
                </span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6, lineHeight: 1.4 }}>{a.title}</h3>
                <p style={{ margin: 0, fontSize: 12, color: '#71717a', lineHeight: 1.5, marginBottom: 12 }}>{a.excerpt}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(a)} style={{ flex: 1, background: 'transparent', border: '1px solid #27272a', color: '#a1a1aa', padding: '8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span> Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)} style={{ background: 'transparent', border: '1px solid #ef444430', color: '#ef4444', padding: '8px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#0b0c16', border: '1px solid #27272a', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', borderRadius: 16, padding: 0 }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #18181b' }}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white' }}>
                {editingId ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', padding: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {/* Form Body */}
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Tag</label>
                <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {tagOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Date / Timestamp</label>
                <input type="datetime-local" value={form.date ? new Date(form.date).toISOString().slice(0,16) : ''} onChange={(e) => setForm({ ...form, date: e.target.value ? new Date(e.target.value).toISOString() : '' })} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://ik.imagekit.io/..." style={inputStyle} />
                {form.imageUrl && (
                  <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid #27272a', height: 120 }}>
                    <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Excerpt (short summary for card)</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary shown on the homepage card..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div>
                <label style={labelStyle}>Full Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full article body. Use new lines for paragraphs..." rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid #27272a', color: '#a1a1aa', padding: '10px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 10 }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={{ background: '#004491', border: '1px solid #004491', color: 'white', padding: '10px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 10, opacity: saving ? 0.5 : 1 }}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== Subscribers Manager ==================== */
function SubscribersManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const ADMIN_SECRET = "uok-cyber-circuit-admin-x9k4m7";

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers', { headers: { 'x-admin-secret': ADMIN_SECRET } });
      const data = await res.json();
      if (data.success) setSubscribers(data.subscribers);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/subscribers', { headers: { 'x-admin-secret': ADMIN_SECRET } });
        const data = await res.json();
        if (active && data.success) setSubscribers(data.subscribers);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [ADMIN_SECRET]);

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber?')) return;
    try {
      const res = await fetch('/api/subscribers', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchSubscribers();
    } catch (err) { console.error(err); }
  };

  const copyAll = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'white' }}>{subscribers.length}</p>
          <p style={{ margin: 0, fontSize: 9, color: '#52525b', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Subscribers</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchSubscribers} style={{ background: '#0b0c16', border: '1px solid #27272a', color: '#a1a1aa', padding: '8px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', borderRadius: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span> Refresh
          </button>
          {subscribers.length > 0 && (
            <button onClick={copyAll} style={{ background: '#004491', border: '1px solid #004491', color: 'white', padding: '8px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', borderRadius: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{copied ? 'check' : 'content_copy'}</span>
              {copied ? 'Copied!' : 'Copy All Emails'}
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 24, height: 24, border: '2px solid #27272a', borderTopColor: '#004491', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p style={{ color: '#52525b', fontSize: 11, marginTop: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty */}
      {!loading && subscribers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#52525b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12, display: 'block' }}>mail</span>
          <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>No subscribers yet</p>
        </div>
      )}

      {/* Table */}
      {!loading && subscribers.length > 0 && (
        <div style={{ background: '#0b0c16', border: '1px solid #18181b', overflow: 'hidden', borderRadius: 12 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  {['#', 'Email', 'Subscribed At', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#52525b', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #18181b', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#111218')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 14px', color: '#52525b', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'white' }}>{s.email}</td>
                    <td style={{ padding: '10px 14px', color: '#71717a', whiteSpace: 'nowrap', fontSize: 11 }}>
                      {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => handleDelete(s.id)} style={{ background: 'transparent', border: '1px solid #ef444430', color: '#ef4444', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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

/* ==================== Team T-Shirt Orders in Team Modal ==================== */
function TeamTshirtOrdersDetail({ teamId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/tshirt?teamId=${encodeURIComponent(teamId)}`);
        const data = await res.json();
        if (active && data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.warn("Failed to load team tshirt orders:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [teamId]);

  if (loading) {
    return (
      <div style={{ padding: "12px 0", borderTop: "1px solid #18181b", color: "#71717a", fontSize: 11 }}>
        Checking team T-shirt pre-orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  const totalShirts = orders.reduce((sum, o) => sum + (o.shirtCount || (o.shirts?.length || 0)), 0);

  return (
    <DetailSection icon="apparel" title={`Team T-Shirt Orders (${totalShirts} Jerseys)`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.map((o) => (
          <div key={o.orderId || o.id} style={{ background: "#080808", border: "1px solid #18181b", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontFamily: "monospace", color: "#00d2ff", fontWeight: 700, fontSize: 11 }}>
                {o.orderId || o.id}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", background: o.status === "verified" ? "#10b98115" : "#f59e0b15", color: o.status === "verified" ? "#10b981" : "#f59e0b", border: `1px solid ${o.status === "verified" ? "#10b98130" : "#f59e0b30"}`, borderRadius: 4 }}>
                {o.status || "Pending"}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
              {(o.shirts || []).map((s, idx) => (
                <span key={idx} style={{ fontSize: 10, background: "#111218", border: "1px solid #27272a", padding: "3px 8px", borderRadius: 4, color: "#e4e4e7" }}>
                  <strong style={{ color: "#5b9aff" }}>{s.memberName || `Member ${idx + 1}`}</strong>: {s.size} ({s.category})
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#71717a", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #18181b", paddingTop: 6, flexWrap: "wrap", gap: 6 }}>
              <span>Total: <strong style={{ color: "#10b981" }}>LKR {((o.shirtCount || (o.shirts?.length || 0)) * 1900).toLocaleString()}</strong></span>
              {o.referenceNumber && <span>Ref: {o.referenceNumber}</span>}
              {o.driveViewUrl ? (
                <a
                  href={o.driveViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#5b9aff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>open_in_new</span>
                  View Slip
                </a>
              ) : (
                o.slipName && <span>Slip: {o.slipName}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </DetailSection>
  );
}

/* ==================== T-Shirt Orders Manager ==================== */
function TshirtOrdersManager({ ADMIN_SECRET }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tshirt", {
        headers: { "x-admin-secret": ADMIN_SECRET },
      });
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Fetch tshirt orders failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/tshirt", {
          headers: { "x-admin-secret": ADMIN_SECRET },
        });
        const data = await res.json();
        if (active && data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Fetch tshirt orders failed:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [ADMIN_SECRET]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/tshirt", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": ADMIN_SECRET,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            (o.orderId || o.id) === orderId ? { ...o, status: newStatus } : o
          )
        );
        if (selectedOrder && (selectedOrder.orderId || selectedOrder.id) === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Error updating order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export-tshirt", {
        headers: { "x-admin-secret": ADMIN_SECRET },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `UOK_Robot_Games_Tshirt_Orders_${Date.now()}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        alert(data.message || "Export failed.");
      }
    } catch (err) {
      console.error("Tshirt export error:", err);
      alert("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  // Metrics computation
  const totalOrders = orders.length;
  const verifiedOrders = orders.filter((o) => o.status === "verified").length;
  const pendingOrders = orders.filter((o) => o.status !== "verified").length;
  const totalShirts = orders.reduce(
    (sum, o) => sum + (o.shirtCount || (o.shirts?.length || 0)),
    0
  );
  const totalRevenue = totalShirts * 1900;
  const teamOrdersCount = orders.filter((o) => Boolean(o.teamId)).length;
  const publicOrdersCount = orders.filter((o) => !o.teamId).length;

  // Size breakdown counts across all orders
  const sizeCounts = {
    normal: { XS: 0, S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 },
    kids: { "2XS": 0, XS: 0, S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  };

  orders.forEach((o) => {
    (o.shirts || []).forEach((s) => {
      const isKids = s.category === "Kids Size";
      const sz = s.size;
      if (isKids) {
        if (sizeCounts.kids[sz] !== undefined) sizeCounts.kids[sz]++;
      } else {
        if (sizeCounts.normal[sz] !== undefined) sizeCounts.normal[sz]++;
      }
    });
  });

  // Filtered orders list
  const filtered = orders.filter((o) => {
    const orderId = (o.orderId || o.id || "").toLowerCase();
    const teamName = (o.teamName || "").toLowerCase();
    const contactName = (o.name || "").toLowerCase();
    const phone = (o.whatsappNumber || "").toLowerCase();
    const ref = (o.referenceNumber || "").toLowerCase();
    const shirtsText = (o.shirts || [])
      .map((s) => `${s.memberName} ${s.size} ${s.category}`)
      .join(" ")
      .toLowerCase();

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      orderId.includes(q) ||
      teamName.includes(q) ||
      contactName.includes(q) ||
      phone.includes(q) ||
      ref.includes(q) ||
      shirtsText.includes(q);

    const matchesType =
      filterType === "all"
        ? true
        : filterType === "team"
        ? Boolean(o.teamId)
        : !o.teamId;

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "verified"
        ? o.status === "verified"
        : o.status !== "verified";

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCopySizeSummary = () => {
    let text = `UOK Robot Games 2K26 - T-Shirt Manufacturing Breakdown\nTotal Orders: ${totalOrders} | Total Jerseys: ${totalShirts} | Total Revenue: LKR ${totalRevenue.toLocaleString()}\n\n`;
    text += `ADULT / NORMAL SIZES:\n`;
    Object.entries(sizeCounts.normal).forEach(([sz, qty]) => {
      text += `• ${sz}: ${qty}\n`;
    });
    text += `\nKIDS SIZES:\n`;
    Object.entries(sizeCounts.kids).forEach(([sz, qty]) => {
      text += `• ${sz}: ${qty}\n`;
    });
    navigator.clipboard?.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#0b0c16", border: "1px solid #18181b", padding: "16px 20px", position: "relative", overflow: "hidden", borderRadius: 12 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#004491" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 9, color: "#71717a", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Total Orders</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "white", marginTop: 4 }}>{totalOrders}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#10b981", marginTop: 2 }}>{verifiedOrders} Verified · {pendingOrders} Pending</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#004491" }}>receipt_long</span>
          </div>
        </div>

        <div style={{ background: "#0b0c16", border: "1px solid #18181b", padding: "16px 20px", position: "relative", overflow: "hidden", borderRadius: 12 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#00d2ff" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 9, color: "#71717a", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Jerseys Ordered</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "white", marginTop: 4 }}>{totalShirts}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#00d2ff", marginTop: 2 }}>Official Arena Jerseys</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#00d2ff" }}>apparel</span>
          </div>
        </div>

        <div style={{ background: "#0b0c16", border: "1px solid #18181b", padding: "16px 20px", position: "relative", overflow: "hidden", borderRadius: 12 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#10b981" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 9, color: "#71717a", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Total Revenue</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#10b981", marginTop: 4, fontFamily: "monospace" }}>LKR {totalRevenue.toLocaleString()}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#71717a", marginTop: 2 }}>@ LKR 1,800 / Jersey</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#10b981" }}>payments</span>
          </div>
        </div>

        <div style={{ background: "#0b0c16", border: "1px solid #18181b", padding: "16px 20px", position: "relative", overflow: "hidden", borderRadius: 12 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#8b5cf6" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 9, color: "#71717a", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Order Breakdown</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white", marginTop: 4 }}>{teamOrdersCount} <span style={{ fontSize: 11, color: "#a1a1aa", fontWeight: 400 }}>Team</span></p>
              <p style={{ margin: 0, fontSize: 10, color: "#8b5cf6", marginTop: 2 }}>{publicOrdersCount} Public Pre-Orders</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#8b5cf6" }}>groups</span>
          </div>
        </div>
      </div>

      {/* ── Manufacturing Size Matrix ── */}
      <div style={{ background: "#0b0c16", border: "1px solid #18181b", borderRadius: 12, padding: 18, marginBottom: 24, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#00d2ff" }}>precision_manufacturing</span>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "white" }}>
              Manufacturing Size Matrix (Production Quantities)
            </span>
          </div>
          <button
            onClick={handleCopySizeSummary}
            style={{
              background: "#111218", border: "1px solid #27272a", color: copiedSummary ? "#10b981" : "#a1a1aa",
              padding: "6px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {copiedSummary ? "check" : "content_copy"}
            </span>
            {copiedSummary ? "Copied for Factory" : "Copy for Factory"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {/* Normal Sizes */}
          <div style={{ background: "#080808", border: "1px solid #18181b", borderRadius: 10, padding: 14 }}>
            <p style={{ margin: "0 0 10px 0", fontSize: 10, fontWeight: 700, color: "#00d2ff", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Adult / Normal Sizes ({Object.values(sizeCounts.normal).reduce((a, b) => a + b, 0)} Total)
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(sizeCounts.normal).map(([sz, qty]) => (
                <div key={sz} style={{ background: qty > 0 ? "#00449115" : "#111218", border: `1px solid ${qty > 0 ? "#00449140" : "#27272a"}`, padding: "6px 12px", borderRadius: 8, textAlign: "center", minWidth: 54 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: qty > 0 ? "#00d2ff" : "#71717a", display: "block" }}>{sz}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: qty > 0 ? "white" : "#52525b", fontFamily: "monospace" }}>{qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kids Sizes */}
          <div style={{ background: "#080808", border: "1px solid #18181b", borderRadius: 10, padding: 14 }}>
            <p style={{ margin: "0 0 10px 0", fontSize: 10, fontWeight: 700, color: "#5b9aff", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Kids Sizes ({Object.values(sizeCounts.kids).reduce((a, b) => a + b, 0)} Total)
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(sizeCounts.kids).map(([sz, qty]) => (
                <div key={sz} style={{ background: qty > 0 ? "#5b9aff15" : "#111218", border: `1px solid ${qty > 0 ? "#5b9aff40" : "#27272a"}`, padding: "6px 12px", borderRadius: 8, textAlign: "center", minWidth: 54 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: qty > 0 ? "#5b9aff" : "#71717a", display: "block" }}>{sz}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: qty > 0 ? "white" : "#52525b", fontFamily: "monospace" }}>{qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search, Filters & Export ── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, Team Name, Buyer, Phone, Size..."
          style={{ flex: 1, minWidth: 220, background: "#0b0c16", border: "1px solid #27272a", color: "#e4e4e7", fontSize: 13, padding: "10px 14px", outline: "none", fontFamily: "inherit", borderRadius: 10 }}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ background: "#0b0c16", border: "1px solid #27272a", color: "#a1a1aa", fontSize: 12, padding: "10px 14px", outline: "none", cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}
        >
          <option value="all">All Order Types</option>
          <option value="team">Team Orders Only</option>
          <option value="public">Public Pre-Orders</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ background: "#0b0c16", border: "1px solid #27272a", color: "#a1a1aa", fontSize: 12, padding: "10px 14px", outline: "none", cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}
        >
          <option value="all">All Statuses</option>
          <option value="verified">Verified Only</option>
          <option value="pending">Pending Only</option>
        </select>

        <button
          onClick={fetchOrders}
          style={{ background: "#0b0c16", border: "1px solid #27272a", color: "#a1a1aa", padding: "10px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit", borderRadius: 10 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
          Refresh
        </button>

        <button
          onClick={handleExportExcel}
          disabled={exporting || orders.length === 0}
          style={{ background: "#004491", border: "1px solid #004491", color: "white", padding: "10px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: exporting ? 0.5 : 1, fontFamily: "inherit", borderRadius: 10 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
          {exporting ? "Exporting..." : "Export Excel (.xlsx)"}
        </button>
      </div>

      {/* ── Orders Table ── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 24, height: 24, border: "2px solid #27272a", borderTopColor: "#004491", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          <p style={{ color: "#52525b", fontSize: 11, marginTop: 12, letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading T-shirt orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#52525b", background: "#0b0c16", border: "1px solid #18181b", borderRadius: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12, display: "block" }}>apparel</span>
          <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>No T-shirt orders match the selected filters</p>
        </div>
      ) : (
        <div style={{ background: "#0b0c16", border: "1px solid #18181b", overflow: "hidden", borderRadius: 12 }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #27272a" }}>
                  {["#", "Order ID", "Team / Buyer", "Contact", "Qty", "Sizes Breakdown", "Total (LKR)", "Slip / Ref", "Status", "Date", "Action"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ord, i) => {
                  const count = ord.shirtCount || (ord.shirts?.length || 0);
                  const amount = count * 1900;

                  // Group sizes for compact badge view
                  const sizeMap = {};
                  (ord.shirts || []).forEach((s) => {
                    const label = s.category === "Kids Size" ? `Kids ${s.size}` : s.size;
                    sizeMap[label] = (sizeMap[label] || 0) + 1;
                  });

                  return (
                    <tr
                      key={ord.orderId || ord.id || i}
                      style={{ borderBottom: "1px solid #18181b", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#111218")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "10px 14px", color: "#52525b", fontWeight: 600 }}>{i + 1}</td>

                      {/* Order ID */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "monospace", color: "#00d2ff", fontWeight: 700, fontSize: 11 }}>
                          {ord.orderId || ord.id}
                        </span>
                      </td>

                      {/* Team / Buyer */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        {ord.teamName ? (
                          <div>
                            <span style={{ fontWeight: 700, color: "white", display: "block" }}>{ord.teamName}</span>
                            <span style={{ fontSize: 9, color: "#5b9aff", textTransform: "uppercase", letterSpacing: "0.1em" }}>Registered Team</span>
                          </div>
                        ) : (
                          <span style={{ display: "inline-block", padding: "2px 8px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", background: "#27272a30", color: "#a1a1aa", border: "1px solid #27272a", borderRadius: 4 }}>
                            Public Pre-Order
                          </span>
                        )}
                      </td>

                      {/* Contact */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#e4e4e7", fontWeight: 600, display: "block" }}>{ord.name}</span>
                        {ord.whatsappNumber && (
                          <a
                            href={`https://wa.me/${ord.whatsappNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#10b981", fontSize: 11, fontFamily: "monospace", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chat</span>
                            {ord.whatsappNumber}
                          </a>
                        )}
                      </td>

                      {/* Qty */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ padding: "3px 8px", background: "#00449115", border: "1px solid #00449130", borderRadius: 4, color: "#5b9aff", fontWeight: 800, fontSize: 11 }}>
                          {count} {count === 1 ? "Shirt" : "Shirts"}
                        </span>
                      </td>

                      {/* Sizes Breakdown */}
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 220 }}>
                          {Object.entries(sizeMap).map(([sz, qty]) => (
                            <span key={sz} style={{ fontSize: 10, background: "#18181b", border: "1px solid #27272a", padding: "2px 6px", borderRadius: 4, color: "#e4e4e7", whiteSpace: "nowrap" }}>
                              {sz} <strong style={{ color: "#00d2ff" }}>×{qty}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total (LKR) */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap", fontFamily: "monospace", fontWeight: 700, color: "#10b981" }}>
                        LKR {amount.toLocaleString()}
                      </td>

                      {/* Slip / Ref */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap", fontSize: 11 }}>
                        {ord.referenceNumber ? (
                          <span style={{ color: "white", fontFamily: "monospace", display: "block" }}>Ref: {ord.referenceNumber}</span>
                        ) : null}
                        {ord.driveViewUrl ? (
                          <a
                            href={ord.driveViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#10b981", fontSize: 10, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, marginTop: 2 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>visibility</span>
                            View Slip
                          </a>
                        ) : (
                          <span style={{ color: ord.hasPaymentSlip ? "#10b981" : "#71717a", fontSize: 10 }}>
                            {ord.hasPaymentSlip ? "Slip Attached" : "No Slip"}
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => handleUpdateStatus(ord.orderId || ord.id, ord.status === "verified" ? "pending" : "verified")}
                          disabled={updatingId === (ord.orderId || ord.id)}
                          style={{
                            background: ord.status === "verified" ? "#10b98115" : "#f59e0b15",
                            color: ord.status === "verified" ? "#10b981" : "#f59e0b",
                            border: `1px solid ${ord.status === "verified" ? "#10b98130" : "#f59e0b30"}`,
                            padding: "4px 10px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                            textTransform: "uppercase", cursor: "pointer", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                            {ord.status === "verified" ? "check_circle" : "pending"}
                          </span>
                          {ord.status === "verified" ? "Verified" : "Pending"}
                        </button>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "10px 14px", color: "#52525b", whiteSpace: "nowrap", fontSize: 11 }}>
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-LK", { day: "2-digit", month: "short" }) : "—"}
                      </td>

                      {/* Action */}
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          style={{ background: "#080808", border: "1px solid #27272a", color: "#e4e4e7", padding: "6px 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", cursor: "pointer", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#00d2ff" }}>visibility</span>
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0b0c16", border: "1px solid #27272a", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", borderRadius: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #18181b" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "monospace", color: "#00d2ff", fontWeight: 800, fontSize: 15 }}>
                    {selectedOrder.orderId || selectedOrder.id}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", background: selectedOrder.status === "verified" ? "#10b98115" : "#f59e0b15", color: selectedOrder.status === "verified" ? "#10b981" : "#f59e0b", border: `1px solid ${selectedOrder.status === "verified" ? "#10b98130" : "#f59e0b30"}`, borderRadius: 4 }}>
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#71717a" }}>
                  {selectedOrder.teamName ? `Team: ${selectedOrder.teamName}` : "Public Pre-Order"} · {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString("en-LK") : ""}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 20 }}>
              {/* Contact Information */}
              <DetailSection icon="person" title="Buyer & WhatsApp Details">
                <DetailGrid>
                  <DetailItem label="Contact Name" value={selectedOrder.name} />
                  <DetailItem label="WhatsApp Number" value={selectedOrder.whatsappNumber} highlight />
                  <DetailItem label="Order Type" value={selectedOrder.teamId ? `Team Order (${selectedOrder.teamName})` : "General Public"} />
                  <DetailItem label="Total Quantity" value={`${selectedOrder.shirtCount || selectedOrder.shirts?.length} Jerseys`} />
                </DetailGrid>
                {selectedOrder.whatsappNumber && (
                  <div style={{ marginTop: 10 }}>
                    <a
                      href={`https://wa.me/${selectedOrder.whatsappNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px", background: "#10b98115", color: "#10b981", border: "1px solid #10b98130", textDecoration: "none", cursor: "pointer", borderRadius: 6 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chat</span>
                      Open WhatsApp Chat
                    </a>
                  </div>
                )}
              </DetailSection>

              {/* Shirts Allocation */}
              <DetailSection icon="apparel" title="T-Shirt Allocation & Member Sizes">
                <div style={{ border: "1px solid #18181b", borderRadius: 8, overflow: "hidden", background: "#080808" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: "#111218", borderBottom: "1px solid #27272a" }}>
                        <th style={{ padding: "8px 10px", textAlign: "center", color: "#52525b", width: 30 }}>#</th>
                        <th style={{ padding: "8px 10px", textAlign: "left", color: "#a1a1aa" }}>Member / Name</th>
                        <th style={{ padding: "8px 10px", textAlign: "left", color: "#a1a1aa" }}>Role</th>
                        <th style={{ padding: "8px 10px", textAlign: "left", color: "#a1a1aa" }}>Category</th>
                        <th style={{ padding: "8px 10px", textAlign: "left", color: "#a1a1aa" }}>Size</th>
                        <th style={{ padding: "8px 10px", textAlign: "right", color: "#a1a1aa" }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.shirts || []).map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #18181b" }}>
                          <td style={{ padding: "8px 10px", textAlign: "center", color: "#52525b" }}>{idx + 1}</td>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: "white" }}>{s.memberName || `Shirt #${idx + 1}`}</td>
                          <td style={{ padding: "8px 10px", color: "#71717a" }}>{s.memberRole || "—"}</td>
                          <td style={{ padding: "8px 10px", color: "#a1a1aa" }}>{s.category || "Normal Size"}</td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#00d2ff", background: "#00449120", border: "1px solid #00449140", padding: "2px 6px", borderRadius: 4 }}>
                              {s.size}
                            </span>
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#10b981" }}>LKR 1,900</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid #18181b" }}>
                  <span style={{ fontSize: 11, color: "#a1a1aa" }}>Total Payable</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#10b981", fontFamily: "monospace" }}>
                    LKR {((selectedOrder.shirtCount || selectedOrder.shirts?.length || 0) * 1900).toLocaleString()}
                  </span>
                </div>
              </DetailSection>

              {/* Payment Slip & Verification Actions */}
              <DetailSection icon="receipt_long" title="Payment Verification & Slip" noBorder>
                <DetailGrid>
                  <DetailItem label="Bank Reference / Txn ID" value={selectedOrder.referenceNumber || "Not specified"} highlight={Boolean(selectedOrder.referenceNumber)} />
                  <DetailItem label="Slip File" value={selectedOrder.slipName || (selectedOrder.hasPaymentSlip ? "Slip Attached" : "No Slip")} />
                </DetailGrid>

                {/* Slip Preview & Google Drive View */}
                {selectedOrder.driveViewUrl ? (
                  <div style={{ marginTop: 14 }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: 9, color: "#52525b", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      Bank Slip Preview
                    </p>
                    {(() => {
                      const match = selectedOrder.driveViewUrl?.match(/\/d\/([^/]+)/);
                      const fileId = selectedOrder.driveFileId || match?.[1] || (selectedOrder.driveThumbnailUrl?.match(/[?&]id=([^&]+)/)?.[1]);
                      if (fileId) {
                        return (
                          <div style={{ border: "1px solid #27272a", overflow: "hidden", marginBottom: 10, borderRadius: 8, background: "#111" }}>
                            <img
                              src={`https://lh3.googleusercontent.com/d/${fileId}=w600`}
                              alt="Payment Slip"
                              style={{ maxWidth: "100%", height: "auto", display: "block", maxHeight: 300, objectFit: "contain", margin: "0 auto" }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.display = 'none';
                              }}
                            />
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <a
                      href={selectedOrder.driveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 14px", background: "#00449115", color: "#5b9aff", border: "1px solid #00449130", textDecoration: "none", cursor: "pointer", borderRadius: 8 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      View Slip on Google Drive
                    </a>
                  </div>
                ) : selectedOrder.hasPaymentSlip ? (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "#18181b50", border: "1px solid #27272a", borderRadius: 8, fontSize: 11, color: "#a1a1aa" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle", marginRight: 6, color: "#f59e0b" }}>info</span>
                    Payment slip was submitted with this order ({selectedOrder.slipName || 'slip file'}).
                  </div>
                ) : null}

                {/* Status Toggle Actions */}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #18181b", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                    Change Status:
                  </span>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId || selectedOrder.id, "verified")}
                    disabled={selectedOrder.status === "verified" || updatingId === (selectedOrder.orderId || selectedOrder.id)}
                    style={{
                      background: selectedOrder.status === "verified" ? "#10b981" : "#111218",
                      color: selectedOrder.status === "verified" ? "black" : "#10b981",
                      border: "1px solid #10b981",
                      padding: "8px 14px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                      textTransform: "uppercase", cursor: selectedOrder.status === "verified" ? "default" : "pointer", borderRadius: 8,
                      opacity: selectedOrder.status === "verified" ? 0.6 : 1,
                    }}
                  >
                    ✓ Mark as Verified
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId || selectedOrder.id, "pending")}
                    disabled={selectedOrder.status !== "verified" || updatingId === (selectedOrder.orderId || selectedOrder.id)}
                    style={{
                      background: selectedOrder.status !== "verified" ? "#f59e0b" : "#111218",
                      color: selectedOrder.status !== "verified" ? "black" : "#f59e0b",
                      border: "1px solid #f59e0b",
                      padding: "8px 14px", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                      textTransform: "uppercase", cursor: selectedOrder.status !== "verified" ? "default" : "pointer", borderRadius: 8,
                      opacity: selectedOrder.status !== "verified" ? 0.6 : 1,
                    }}
                  >
                    Set to Pending
                  </button>
                </div>
              </DetailSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

