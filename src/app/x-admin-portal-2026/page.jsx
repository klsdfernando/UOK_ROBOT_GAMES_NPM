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
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #18181b' }}>
          {['teams', 'announcements', 'subscribers'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
              background: activeTab === tab ? '#0b0c16' : 'transparent',
              color: activeTab === tab ? '#5b9aff' : '#52525b',
              border: activeTab === tab ? '1px solid #27272a' : '1px solid transparent',
              borderBottom: activeTab === tab ? '1px solid #0b0c16' : '1px solid transparent',
              borderRadius: '10px 10px 0 0', marginBottom: -1,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 6 }}>
                {tab === 'teams' ? 'groups' : tab === 'announcements' ? 'campaign' : 'mail'}
              </span>
              {tab}
            </button>
          ))}
        </div>

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

  useEffect(() => { fetchAnnouncements(); }, []);

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

  useEffect(() => { fetchSubscribers(); }, []);

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
