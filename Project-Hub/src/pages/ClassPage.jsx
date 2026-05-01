import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";

const ClassPage = () => {
  const { classId } = useParams();

  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  const [team, setTeam] = useState([
    { name: "", regNo: "" },
    { name: "", regNo: "" },
    { name: "", regNo: "" },
  ]);

  const [idea, setIdea] = useState({
    title: "",
    description: "",
    members: "",
  });

  useEffect(() => {
    if (classId) fetchData();
  }, [classId]);

  const fetchData = async () => {
    try {
      const [availRes, selRes] = await Promise.all([
        API.get(`project/available/${classId}`),
        API.get(`project/selected/${classId}`),
      ]);
      setAvailable(availRes.data || []);
      setSelected(selRes.data || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  const openTeamModal = (project) => {
    setSelectedProject(project);
    setShowTeamModal(true);
  };

  const handleSelectProject = async () => {
    try {
      const studentIds = team
        .map((t) => Number(t.regNo))
        .filter((id) => !isNaN(id) && id !== 0);

      if (studentIds.length === 0) {
        alert("Enter valid student IDs");
        return;
      }

      const payload = {
        projectId: selectedProject.projectId,
        studentIds,
      };

      await API.post("/project/select", payload);
      alert("Project Selected ✅");
      setShowTeamModal(false);
      fetchData();
    } catch (err) {
      console.error("SELECT ERROR:", err);
    }
  };

  const handleSubmitIdea = async () => {
    try {
      const studentIds = idea.members
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id));

      if (!idea.title || !idea.description) {
        alert("Fill all fields");
        return;
      }

      const payload = {
        classId: Number(classId),
        title: idea.title,
        description: idea.description,
        studentIds,
      };

      await API.post("/ideas/submit", payload);
      alert("Idea Submitted ✅");
      setShowIdeaModal(false);
      fetchData();
    } catch (err) {
      console.error("IDEA ERROR:", err);
    }
  };

  return (
    <>
      <style>{`
        /* ── Base ── */
        .cp-page {
          min-height: 100vh;
          background: #f7f7f5;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        /* ── Topbar ── */
        .cp-topbar {
          background: #fff;
          border-bottom: 1px solid #e5e5e0;
          padding: 0 2rem;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }
             .logo {
  font-size: 22px;
  font-weight: 800;
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: 0.5px;
}

.logo span {
  color: #2f6d5e;
}
        .cp-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a1a;
          text-decoration: none;
          font-family: 'Georgia', serif;
        }
        .cp-logo svg {
          color: #2d5a3d;
        }
        .cp-class-badge {
          font-size: 0.82rem;
          color: #555;
          font-family: 'Courier New', monospace;
          background: #f0f0ec;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid #e0e0d8;
        }

        /* ── Main content ── */
        .cp-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        /* ── Back link ── */
        .cp-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #666;
          text-decoration: none;
          margin-bottom: 1.5rem;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .cp-back:hover { color: #1a1a1a; }

        /* ── Page title ── */
        .cp-title {
          font-size: 1.9rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 2rem;
          letter-spacing: -0.5px;
        }

        /* ── Section header ── */
        .cp-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
          margin-top: 2rem;
        }
        .cp-section-header svg {
          color: #2d5a3d;
        }

        /* ── Grid ── */
        .cp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        /* ── Selected card ── */
        .cp-sel-card {
          background: #fff;
          border: 2px solid #2d5a3d;
          border-radius: 10px;
          padding: 1.2rem 1.4rem;
          transition: box-shadow 0.2s;
        }
        .cp-sel-card:hover { box-shadow: 0 4px 16px rgba(45,90,61,0.10); }
        .cp-sel-card h6 {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.7rem;
        }
        .cp-teammates {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }
        .cp-teammates svg {
          color: #888;
          flex-shrink: 0;
        }
        .cp-badge {
          display: inline-block;
          padding: 2px 10px;
          border: 1px solid #d0d0c8;
          border-radius: 20px;
          font-size: 0.78rem;
          color: #444;
          background: #fafaf8;
          font-family: 'Courier New', monospace;
        }

        /* ── Available card ── */
        .cp-avail-card {
          background: #fff;
          border: 1px solid #e5e5e0;
          border-radius: 10px;
          padding: 1.2rem 1.4rem;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .cp-avail-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          border-color: #c8c8c0;
        }
        .cp-avail-card h6 {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.35rem;
        }
        .cp-avail-card p {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 1rem;
          flex: 1;
          line-height: 1.5;
        }

        /* ── Buttons ── */
        .cp-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #2d5a3d;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 9px 18px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          font-family: inherit;
          width: 100%;
        }
        .cp-btn-primary:hover { background: #23472f; }
        .cp-btn-primary:active { transform: scale(0.98); }

        .cp-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          color: #2d5a3d;
          border: 1.5px solid #2d5a3d;
          border-radius: 7px;
          padding: 9px 18px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: inherit;
        }
        .cp-btn-outline:hover { background: #2d5a3d; color: #fff; }

        .cp-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: #666;
          border: 1.5px solid #d0d0c8;
          border-radius: 7px;
          padding: 9px 18px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
          width: 100%;
          margin-top: 8px;
        }
        .cp-btn-secondary:hover { background: #f0f0ec; }

        /* ── Idea card ── */
        .cp-idea-card {
          background: #fff;
          border: 1px solid #e5e5e0;
          border-radius: 10px;
          padding: 1.4rem 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cp-idea-card p {
          font-size: 0.88rem;
          color: #555;
          margin: 0;
        }

        /* ── Modal overlay ── */
        .cp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: cpFadeIn 0.15s ease;
        }
        @keyframes cpFadeIn { from { opacity: 0 } to { opacity: 1 } }

        .cp-modal {
          background: #fff;
          border-radius: 14px;
          padding: 2rem;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          animation: cpSlideUp 0.2s ease;
        }
        @keyframes cpSlideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        .cp-modal h5 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }
        .cp-modal .cp-modal-sub {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 1.4rem;
        }
        .cp-modal-divider {
          border: none;
          border-top: 1px solid #eee;
          margin: 1rem 0;
        }

        /* ── Form controls ── */
        .cp-field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          display: block;
        }
        .cp-input {
          width: 100%;
          border: 1.5px solid #e0e0d8;
          border-radius: 7px;
          padding: 9px 12px;
          font-size: 0.88rem;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s;
          background: #fafaf8;
          font-family: inherit;
          box-sizing: border-box;
        }
        .cp-input:focus { border-color: #2d5a3d; background: #fff; }
        .cp-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .cp-member-row {
          background: #fafaf8;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 8px;
        }
        .cp-member-row-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #2d5a3d;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .cp-member-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        /* ── Empty state ── */
        .cp-empty {
          font-size: 0.85rem;
          color: #aaa;
          padding: 1rem 0;
          font-style: italic;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .cp-title { font-size: 1.4rem; }
          .cp-topbar { padding: 0 1rem; }
          .cp-main { padding: 1.2rem 1rem 3rem; }
          .cp-grid { grid-template-columns: 1fr; }
          .cp-idea-card { flex-direction: column; align-items: flex-start; }
          .cp-member-fields { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cp-page">
        {/* Topbar */}
        <div className="cp-topbar">
          <h4 className="logo">
          <span>Project</span> Hub
        </h4>
          <span className="cp-class-badge">Class: {classId}</span>
        </div>

        {/* Main */}
        <div className="cp-main">
          {/* Back */}
          <button className="cp-back" onClick={() => window.history.back()}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>

          {/* Title */}
          <h1 className="cp-title">Project Selection — {classId}</h1>

          {/* ── Projects Selected ── */}
          <div className="cp-section-header">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Projects Selected
          </div>

          {selected.length === 0 ? (
            <p className="cp-empty">No projects selected yet.</p>
          ) : (
            <div className="cp-grid">
              {selected.map((p, index) => (
                <div className="cp-sel-card" key={index}>
                  <h6>{p.title}</h6>
                  <div className="cp-teammates">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    {(p.teammates || []).map((t, i) => (
                      <span className="cp-badge" key={i}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Available Projects ── */}
          <div className="cp-section-header" style={{ marginTop: "2.5rem" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
            </svg>
            Available Projects
          </div>

          {available.length === 0 ? (
            <p className="cp-empty">No projects available.</p>
          ) : (
            <div className="cp-grid">
              {available.map((p) => (
                <div className="cp-avail-card" key={p.projectId}>
                  <h6>{p.title}</h6>
                  <p>{p.description}</p>
                  <button className="cp-btn-primary" onClick={() => openTeamModal(p)}>
                    Select Project
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Idea Proposal ── */}
          <div className="cp-section-header" style={{ marginTop: "2.5rem" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Idea Proposal
          </div>

          <div className="cp-idea-card">
            <p>Have your own project idea? Submit it for teacher approval.</p>
            <button className="cp-btn-outline" onClick={() => setShowIdeaModal(true)}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Submit Your Idea
            </button>
          </div>
        </div>
      </div>

      {/* ── Team Modal ── */}
      {showTeamModal && (
        <div className="cp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowTeamModal(false)}>
          <div className="cp-modal">
            <h5>Form Your Team</h5>
            <p className="cp-modal-sub">{selectedProject?.title}</p>
            <hr className="cp-modal-divider" />

            {team.map((member, index) => (
              <div className="cp-member-row" key={index}>
                <div className="cp-member-row-label">Member {index + 1}</div>
                <div className="cp-member-fields">
                  <div>
                    <label className="cp-field-label">Name</label>
                    <input
                      className="cp-input"
                      placeholder="Full name"
                      value={member.name}
                      onChange={(e) => {
                        const newTeam = [...team];
                        newTeam[index].name = e.target.value;
                        setTeam(newTeam);
                      }}
                    />
                  </div>
                  <div>
                    <label className="cp-field-label">Student ID</label>
                    <input
                      className="cp-input"
                      placeholder="Reg. No."
                      value={member.regNo}
                      onChange={(e) => {
                        const newTeam = [...team];
                        newTeam[index].regNo = e.target.value;
                        setTeam(newTeam);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="cp-btn-primary" style={{ marginTop: "12px" }} onClick={handleSelectProject}>
              Confirm Selection
            </button>
            <button className="cp-btn-secondary" onClick={() => setShowTeamModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Idea Modal ── */}
      {showIdeaModal && (
        <div className="cp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowIdeaModal(false)}>
          <div className="cp-modal">
            <h5>Propose Your Idea</h5>
            <p className="cp-modal-sub">Submit a custom project for teacher review</p>
            <hr className="cp-modal-divider" />

            <div style={{ marginBottom: "12px" }}>
              <label className="cp-field-label">Project Title</label>
              <input
                className="cp-input"
                placeholder="e.g. Smart Attendance System"
                value={idea.title}
                onChange={(e) => setIdea({ ...idea, title: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label className="cp-field-label">Description</label>
              <textarea
                className="cp-input cp-textarea"
                placeholder="Describe your idea..."
                value={idea.description}
                onChange={(e) => setIdea({ ...idea, description: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="cp-field-label">Student IDs (comma separated)</label>
              <input
                className="cp-input"
                placeholder="e.g. 101, 102, 103"
                value={idea.members}
                onChange={(e) => setIdea({ ...idea, members: e.target.value })}
              />
            </div>

            <button className="cp-btn-primary" onClick={handleSubmitIdea}>
              Submit Idea
            </button>
            <button className="cp-btn-secondary" onClick={() => setShowIdeaModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <script async type='module' src='https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js'></script>
<zapier-interfaces-chatbot-embed is-popup='true' chatbot-id='cmomly49m001nlxc9wqrbfb66'></zapier-interfaces-chatbot-embed>
    </>
  );
};

export default ClassPage;

