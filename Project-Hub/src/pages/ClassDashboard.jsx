import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClassDashboard.css";

function ClassDashboard() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [titleForm, setTitleForm] = useState({ title: "", description: "" });
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchDashboard = () => {
    axios
      .get(`http://localhost:8080/api/classes/dashboard/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchDashboard(); }, [classId]);

  const handleAddTitle = async () => {
    try {
      await axios.post(`http://localhost:8080/project/add`, null, {
        params: { classId, title: titleForm.title, description: titleForm.description },
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setTitleForm({ title: "", description: "" });
      fetchDashboard();
    } catch (err) {
      console.error(err);
      alert("Error adding title ❌");
    }
  };

  const updateIdeaStatus = async (ideaId, status) => {
    try {
      await axios.put("http://localhost:8080/ideas/update-status", null, {
        params: { ideaId, status },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDashboard();
    } catch (err) {
      console.error(err);
      alert("Error updating idea status ❌");
    }
  };

  const openAuditLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/audit/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuditLogs(res.data);
      setShowAuditModal(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching audit logs ❌");
    }
  };

  if (!data) return (
    <div className="cd-root">
      <div className="cd-loading">Loading class data…</div>
    </div>
  );

  return (
    <div className="cd-root">

      {/* ── NAV ── */}
      <nav className="cd-nav">
        <h4 className="logo"><span>Project</span> Hub</h4>
        <div className="cd-nav-right">Class: {classId}</div>
      </nav>

      <main className="cd-main">

        {/* BACK */}
        <button className="cd-back" onClick={() => navigate(-1)}>
          ← Back to Profile
        </button>

        {/* PAGE TITLE + ACTIONS */}
        <div className="cd-header-row">
          <div className="cd-page-title">Class Dashboard — {classId}</div>
          <div className="cd-top-actions">
            <button className="cd-btn-primary" onClick={() => setShowModal(true)}>
              + Add New Title
            </button>
            <button className="cd-btn-outline" onClick={openAuditLogs}>
              📋 Audit Logs
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="cd-stats">
          <div className="cd-stat">
            <div className="cd-stat-icon">👥</div>
            <div>
              <div className="cd-stat-num">{data.totalStudents}</div>
              <div className="cd-stat-label">Registered</div>
            </div>
          </div>
          <div className="cd-stat">
            <div className="cd-stat-icon">📁</div>
            <div>
              <div className="cd-stat-num">{data.totalProjects}</div>
              <div className="cd-stat-label">Titles Added</div>
            </div>
          </div>
          <div className="cd-stat">
            <div className="cd-stat-icon">🔗</div>
            <div>
              <div className="cd-stat-num">{data.totalTeams}</div>
              <div className="cd-stat-label">Teams Formed</div>
            </div>
          </div>
          <div className="cd-stat">
            <div className="cd-stat-icon">💡</div>
            <div>
              <div className="cd-stat-num">{data.pendingIdeas}</div>
              <div className="cd-stat-label">Pending Ideas</div>
            </div>
          </div>
        </div>

        {/* ── ADD TITLES DIVIDER ── */}
        <div className="cd-add-titles-row">
          <div className="cd-add-titles-label">＋ Add Titles</div>
        </div>

        {/* ── PROJECTS SELECTED ── */}
        {data.selectedProjects?.length > 0 && (
          <div className="cd-section">
            <div className="cd-section-hd">
              <div className="cd-section-title">✅ Projects Selected</div>
            </div>
            <div className="cd-sel-grid">
              {data.selectedProjects.map((p, i) => (
                <div key={i} className="cd-sel-card">
                  <div className="cd-card-title">{p.title}</div>
                  <div className="cd-members">
                    <span className="cd-members-icon">👤</span>
                    {p.members.map((m, idx) => (
                      <span key={idx} className="cd-chip">{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROJECTS AVAILABLE ── */}
        {data.availableProjects?.length > 0 && (
          <div className="cd-section">
            <div className="cd-section-hd">
              <div className="cd-section-title">🟡 Projects Available</div>
            </div>
            <div className="cd-avail-grid">
              {data.availableProjects.map((p, i) => (
                <div key={i} className="cd-avail-card">{p.title}</div>
              ))}
            </div>
          </div>
        )}

        {/* ── STUDENT IDEAS ── */}
        {data.ideas?.length > 0 && (
          <div className="cd-section">
            <div className="cd-section-hd">
              <div className="cd-section-title">💡 Student Ideas</div>
            </div>
            <div className="cd-idea-grid">
              {data.ideas.map((idea) => (
                <div key={idea.ideaId} className="cd-idea-card">
                  <div className="cd-card-title">{idea.title}</div>
                  <div className="cd-card-desc">{idea.description}</div>
                  <div className="cd-members">
                    <span className="cd-members-icon">👤</span>
                    {idea.members.map((m, i) => (
                      <span key={i} className="cd-chip">{m}</span>
                    ))}
                  </div>
                  <div className="cd-idea-actions">
                    <button
                      className="cd-btn-approve"
                      onClick={() => updateIdeaStatus(idea.ideaId, "APPROVED")}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="cd-btn-reject"
                      onClick={() => updateIdeaStatus(idea.ideaId, "REJECTED")}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── ADD TITLE MODAL ── */}
      {showModal && (
        <div className="cd-overlay" onClick={() => setShowModal(false)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cd-modal-x" onClick={() => setShowModal(false)}>✕</button>
            <div className="cd-modal-title">Add Project Title</div>

            <label className="cd-label">Project Title</label>
            <input
              className="cd-input"
              placeholder="e.g. Smart Parking System"
              value={titleForm.title}
              onChange={(e) => setTitleForm({ ...titleForm, title: e.target.value })}
            />

            <label className="cd-label">Description</label>
            <textarea
              className="cd-textarea"
              placeholder="Brief description of the project…"
              value={titleForm.description}
              onChange={(e) => setTitleForm({ ...titleForm, description: e.target.value })}
            />

            <div className="cd-modal-foot">
              <button className="cd-btn-outline" onClick={() => setShowModal(false)}>Close</button>
              <button className="cd-btn-primary" onClick={handleAddTitle}>Send to Students</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AUDIT LOG MODAL ── */}
      {showAuditModal && (
        <div className="cd-overlay" onClick={() => setShowAuditModal(false)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cd-modal-x" onClick={() => setShowAuditModal(false)}>✕</button>
            <div className="cd-modal-title">📋 Class Audit Logs</div>
            {auditLogs.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: 14 }}>No logs found.</p>
            ) : (
              auditLogs.map((log, i) => (
                <div key={i} className="cd-audit-item">
                  <div className="cd-audit-action">{log.action}</div>
                  <div className="cd-audit-desc">{log.description}</div>
                  <div className="cd-audit-time">{log.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ClassDashboard;