import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// 🔥 Pool of class cover images (cycled by index)
const CLASS_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80", // laptop coding
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80", // code screen
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80", // orange code
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80", // macbook desk
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", // dark office
];

const getClassImage = (index) => CLASS_IMAGES[index % CLASS_IMAGES.length];

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({ classCode: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileRes = await API.get("/student/profile");
      const classRes = await API.get("/student/classes");
      const projectRes = await API.get("/student/projects");
      const ideaRes = await API.get("/student/ideas");

      setProfile(profileRes.data || null);
      setClasses(classRes.data || []);
      setProjects(projectRes.data || []);
      setIdeas(ideaRes.data || []);
    } catch (err) {
      console.error("API ERROR:", err);
    }
  };

  const handleJoinClass = async () => {
    try {
      await API.post(`/student/join-class?classCode=${joinForm.classCode}`);
      alert("Joined class ✅");
      setShowJoinModal(false);
      setJoinForm({ classCode: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error joining class");
    }
  };

 
const handleLogout = () => {
  localStorage.removeItem("token"); // 🔥 remove JWT
  navigate("/"); // 🔥 go to landing page
};
  return (
    <>
      <style>{`
        :root {
          --primary: #1a5c45;
          --primary-light: #2d7a5f;
          --accent: #e8f5f0;
          --text-main: #1a1a2e;
          --text-muted: #6b7280;
          --card-radius: 14px;
          --border: #e5e7eb;
          --shadow: 0 2px 12px rgba(0,0,0,0.07);
        }

        body {
          background-color: #f5f5f4;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* ── NAVBAR ── */
        .sch-navbar {
          background: #fff;
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 58px;
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
        .sch-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-main);
          text-decoration: none;
        }
        .sch-brand-icon {
          width: 34px;
          height: 34px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1rem;
        }
        .sch-nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .sch-logout {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1.1rem;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.15s;
        }
        .sch-logout:hover { background: #f3f4f6; }

        /* ── MAIN ── */
        .sch-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        /* ── PROFILE HEADER ── */
        .sch-profile {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 2.2rem;
        }
        .sch-avatar {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c7e8db 0%, #a3d5c2 100%);
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(26,92,69,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sch-avatar svg {
          width: 44px;
          height: 44px;
        }
        .sch-profile-info .role-tag {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        .sch-profile-info h2 {
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 3px;
        }
        .sch-profile-info .meta {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* ── SECTION HEADER ── */
        .sch-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .sch-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .sch-section-title svg {
          color: var(--primary);
        }

        /* ── JOIN BUTTON ── */
        .btn-join {
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 7px 18px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.18s, transform 0.1s;
        }
        .btn-join:hover {
          background: var(--primary-light);
          transform: translateY(-1px);
        }

        /* ── CLASS CARDS ── */
        .sch-classes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.2rem;
          margin-bottom: 2.5rem;
        }
        .sch-class-card {
          border-radius: var(--card-radius);
          overflow: hidden;
          background: #fff;
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          border: 1px solid var(--border);
        }
        .sch-class-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.11);
        }
        .sch-class-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
        }
        .sch-class-body {
          padding: 14px 16px 16px;
        }
        .sch-class-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .sch-class-meta .teacher {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .sch-class-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 4px;
        }
        .sch-class-cta {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 500;
        }

        /* ── PROJECTS ── */
        .sch-projects {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .sch-project-card {
          background: #fff;
          border-radius: var(--card-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          border-left: 4px solid var(--primary);
          padding: 16px 18px;
        }
        .sch-project-card h6 {
          font-size: 0.97rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 10px;
        }
        .sch-badge-member {
          display: inline-block;
          background: #f3f4f6;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 20px;
          padding: 2px 10px;
          margin-right: 6px;
          margin-bottom: 4px;
        }

        /* ── IDEAS ── */
        .sch-ideas {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .sch-idea-card {
          background: #fff;
          border-radius: var(--card-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          padding: 16px 18px;
          position: relative;
        }
        .sch-idea-card.approved { border-left: 4px solid #16a34a; }
        .sch-idea-card.pending  { border-left: 4px solid #d97706; }
        .sch-idea-card.rejected { border-left: 4px solid #dc2626; }

        .sch-idea-card h6 {
          font-size: 0.97rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 8px;
        }
        .sch-idea-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }
        .sch-status-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 20px;
          padding: 3px 10px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sch-status-badge.approved { background: #dcfce7; color: #15803d; }
        .sch-status-badge.pending  { background: #fef9c3; color: #92400e; }
        .sch-status-badge.rejected { background: #fee2e2; color: #991b1b; }

        /* ── EMPTY STATE ── */
        .sch-empty {
          color: var(--text-muted);
          font-size: 0.9rem;
          padding: 1rem 0;
        }

        /* ── MODAL ── */
        .sch-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sch-modal {
          background: #fff;
          border-radius: 14px;
          width: 90%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          overflow: hidden;
        }
        .sch-modal-header {
          padding: 18px 22px 14px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sch-modal-header h5 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-main);
        }
        .sch-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: var(--text-muted);
          line-height: 1;
          padding: 2px 6px;
          border-radius: 6px;
        }
        .sch-modal-close:hover { background: #f3f4f6; }
        .sch-modal-body { padding: 20px 22px; }
        .sch-modal-body input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          font-size: 0.93rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .sch-modal-body input:focus { border-color: var(--primary); }
        .sch-modal-footer {
          padding: 14px 22px 18px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid var(--border);
        }
        .btn-cancel {
          background: #f3f4f6;
          color: var(--text-main);
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-cancel:hover { background: #e5e7eb; }

        @media (max-width: 576px) {
          .sch-main { padding: 1.2rem 1rem 3rem; }
          .sch-navbar { padding: 0 1rem; }
          .sch-profile { gap: 1rem; }
          .sch-avatar { width: 54px; height: 54px; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="sch-navbar">
        <h4 className="logo">
          <span>Project</span> Hub
        </h4>
        <div className="sch-nav-right">
          <span>Student</span>
          <button className="sch-logout" title="Logout" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="sch-main">

        {/* PROFILE */}
        <div className="sch-profile">
          <div className="sch-avatar">
            {/* Fixed student SVG avatar */}
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="30" r="16" fill="#1a5c45"/>
              <ellipse cx="40" cy="68" rx="24" ry="14" fill="#1a5c45"/>
              <circle cx="40" cy="30" r="13" fill="#a3d5c2"/>
              <path d="M30 30 Q40 20 50 30" fill="#1a5c45"/>
            </svg>
          </div>
          <div className="sch-profile-info">
            <div className="role-tag">Student</div>
            {profile ? (
              <>
                <h2>{profile.name || "Student"}</h2>
                <div className="meta">
                  Reg. No: {profile.regNo || "—"} · {profile.branch || "—"}
                </div>
              </>
            ) : (
              <h2>Loading...</h2>
            )}
          </div>
        </div>

        {/* MY CLASSES */}
        <div className="sch-section-header">
          <div className="sch-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            My Classes
          </div>
          <button className="btn-join" onClick={() => setShowJoinModal(true)}>
            + Join Class
          </button>
        </div>

        <div className="sch-classes">
          {classes.length > 0 ? (
            classes.map((cls, index) => (
              <div
                className="sch-class-card"
                key={cls.classId}
                onClick={() => navigate(`/student/class/${cls.classId}`)}//chagnes the url
              >
                <img
                  src={getClassImage(index)}
                  alt={cls.className}
                  className="sch-class-img"
                  onError={(e) => { e.target.src = CLASS_IMAGES[0]; }}
                />
                <div className="sch-class-body">
                  <div className="sch-class-meta">
                    <span className="teacher">{cls.teacherName || "Teacher"}</span>
                  </div>
                  <h5 className="sch-class-name">{cls.className || "Class"}</h5>
                  <div className="sch-class-cta">View available projects &amp; manage your team →</div>
                </div>
              </div>
            ))
          ) : (
            <p className="sch-empty">No classes found. Join one to get started!</p>
          )}
        </div>

        {/* PROJECTS SELECTED */}
        <div className="sch-section-header">
          <div className="sch-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Projects Selected
          </div>
        </div>

        <div className="sch-projects">
          {projects.length > 0 ? (
            projects.map((p, index) => (
              <div className="sch-project-card" key={p.projectId || p.projectTitle || index}>
                <h6>{p.projectTitle || "No Title"}</h6>
                <div>
                  {(p.teammates || []).map((t, i) => (
                    <span key={`${t}-${i}`} className="sch-badge-member">{t}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="sch-empty">No projects selected yet.</p>
          )}
        </div>

        {/* IDEA STATUS */}
        <div className="sch-section-header">
          <div className="sch-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Idea Status
          </div>
        </div>

        <div className="sch-ideas">
          {ideas.length > 0 ? (
            ideas.map((idea, index) => {
              const statusClass =
                idea.status === "APPROVED" ? "approved" :
                idea.status === "REJECTED" ? "rejected" : "pending";
              return (
                <div className={`sch-idea-card ${statusClass}`} key={idea.id || idea.title || index}>
                  <div className="sch-idea-header">
                    <h6>{idea.title || "No Title"}</h6>
                    <span className={`sch-status-badge ${statusClass}`}>
                      {idea.status === "APPROVED" ? "Approved" :
                       idea.status === "REJECTED" ? "Rejected" : "Pending"}
                    </span>
                  </div>
                  <div>
                    {(idea.members || []).map((m, i) => (
                      <span key={`${m}-${i}`} className="sch-badge-member">{m}</span>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="sch-empty">No ideas submitted yet.</p>
          )}
        </div>
      </div>

      {/* JOIN CLASS MODAL */}
      {showJoinModal && (
        <div className="sch-modal-backdrop" onClick={() => setShowJoinModal(false)}>
          <div className="sch-modal" onClick={e => e.stopPropagation()}>
            <div className="sch-modal-header">
              <h5>Join a Class</h5>
              <button className="sch-modal-close" onClick={() => setShowJoinModal(false)}>✕</button>
            </div>
            <div className="sch-modal-body">
              <input
                type="text"
                placeholder="Enter Class Code"
                value={joinForm.classCode}
                onChange={(e) => setJoinForm({ classCode: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleJoinClass()}
                autoFocus
              />
            </div>
            <div className="sch-modal-footer">
              <button className="btn-cancel" onClick={() => setShowJoinModal(false)}>Cancel</button>
              <button className="btn-join" onClick={handleJoinClass}>Join</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDashboard;