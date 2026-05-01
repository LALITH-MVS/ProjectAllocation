import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ── Rotating cover photos ── */
const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=85",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=85",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&q=85",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=85",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=85",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=900&q=85",
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sc-root {
    font-family: 'DM Sans', sans-serif;
    background: #fefefc;
    min-height: 100vh;
    color: #1a1a1a;
  }

  /* ── NAV (white, light border) ── */
  .sc-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 58px;
    background: #ffffff;
    border-bottom: 1px solid #e8e4dc;
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
  .sc-nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
    text-decoration: none;
  }
  .sc-nav-icon {
    width: 32px;
    height: 32px;
    background: #2d5a4e;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .sc-nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    color: #555;
    font-weight: 500;
  }
  .sc-nav-logout {
    background: none;
    border: none;
    cursor: pointer;
    color: #555;
    font-size: 20px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    padding: 2px;
  }
  .sc-nav-logout:hover { color: #1a1a1a; }

  /* ── MAIN ── */
  .sc-main {
    max-width: 1260px;
    margin: 0 auto;
    padding: 52px 48px 100px;
  }

  /* ── PROFILE ── */
  .sc-profile {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 52px;
  }
  .sc-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #b8d4c8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Lora', serif;
    font-size: 28px;
    font-weight: 700;
    color: #2d5a4e;
    flex-shrink: 0;
    border: 3px solid #fff;
    box-shadow: 0 2px 14px rgba(0,0,0,0.10);
  }
  .sc-profile-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 4px;
  }
  .sc-profile-name {
    font-family: 'Lora', serif;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 3px;
  }
  .sc-profile-sub { font-size: 14px; color: #888; }

  /* ── SECTION HEADER ── */
  .sc-section-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .sc-section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
  }

  /* ── BUTTON ── */
  .sc-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #2d5a4e;
    color: #fff;
    border: none;
    border-radius: 9px;
    padding: 11px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s, transform 0.15s;
    white-space: nowrap;
  }
  .sc-btn:hover { background: #1e3f36; transform: translateY(-1px); }

  /* ── GRID — 2 columns like Scholaris ── */
  .sc-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
  @media (max-width: 780px) { .sc-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .sc-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .sc-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 48px rgba(0,0,0,0.13);
  }

  /* Taller cover image — like Scholaris (approx 310px) */
  .sc-card-cover {
    height: 310px;
    position: relative;
    overflow: hidden;
    background: #1a2a24;
  }
  .sc-card-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.88;
    transition: transform 0.38s ease;
  }
  .sc-card:hover .sc-card-cover img { transform: scale(1.04); }

  /* Bottom overlay gradient */
  .sc-cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.30) 0%, transparent 55%);
  }

  /* Class code badge + student count row — overlaid on image bottom */
  .sc-cover-meta {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sc-code-chip {
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.28);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .sc-student-count {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255,255,255,0.9);
    font-size: 13px;
    font-weight: 500;
  }

  /* Card body below image */
  .sc-card-body { padding: 20px 22px 22px; }
  .sc-card-name {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 5px;
  }
  .sc-card-cta { font-size: 13px; color: #888; }

  /* ── EMPTY ── */
  .sc-empty {
    grid-column: 1/-1;
    text-align: center;
    padding: 72px 24px;
    color: #bbb;
    font-size: 15px;
  }

  /* ── MODAL OVERLAY ── */
  .sc-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.48);
    backdrop-filter: blur(6px);
    z-index: 300;
    display: flex; align-items: center; justify-content: center;
    animation: scFade 0.15s ease;
  }
  @keyframes scFade { from{opacity:0} to{opacity:1} }

  .sc-modal {
    background: #fff;
    border-radius: 18px;
    width: 100%;
    max-width: 470px;
    padding: 36px;
    position: relative;
    animation: scUp 0.2s ease;
    box-shadow: 0 30px 80px rgba(0,0,0,0.22);
  }
  @keyframes scUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .sc-modal-x {
    position: absolute; top: 16px; right: 18px;
    background: none; border: none; font-size: 20px;
    cursor: pointer; color: #aaa; line-height: 1;
    transition: color 0.2s;
  }
  .sc-modal-x:hover { color: #333; }

  .sc-modal-title {
    font-family: 'Lora', serif;
    font-size: 21px; font-weight: 700;
    color: #1a1a1a; margin-bottom: 26px;
  }
  .sc-label {
    display: block; font-size: 13px; font-weight: 500;
    color: #555; margin-bottom: 6px;
  }
  .sc-input {
    width: 100%;
    border: 1.5px solid #e0dbd2;
    border-radius: 9px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #1a1a1a;
    background: #faf9f7; outline: none;
    margin-bottom: 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
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
  .sc-input:focus {
    border-color: #2d5a4e;
    box-shadow: 0 0 0 3px rgba(45,90,78,0.1);
    background: #fff;
  }
  .sc-input::placeholder { color: #c0bbb4; }
  .sc-modal-btn { width: 100%; padding: 14px; margin-top: 4px; font-size: 15px; justify-content: center; }
`;

const FacultyDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subjectName: "", classCode: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/classes/my-classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading classes");
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreateClass = async () => {
    try {
      await axios.post("http://localhost:8080/api/classes/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setForm({ subjectName: "", classCode: "" });
      fetchClasses();
    } catch (err) {
      alert(err.response?.data || "Error creating class");
    }
  };
  
  

const handleLogout = () => {
  localStorage.removeItem("token"); // 🔥 remove JWT
  navigate("/"); // 🔥 go to landing page
};
  const teacher = classes[0];

  return (
    <>
      <style>{styles}</style>
      <div className="sc-root">

        {/* ── NAV: white, light border ── */}
        <nav className="sc-nav">
          <h4 className="logo">
          <span>Project</span> Hub
        </h4>
          <div className="sc-nav-right">
            <span>Faculty</span>
            <button className="sch-logout" title="Logout" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
          </div>
        </nav>

        <main className="sc-main">

          {/* ── PROFILE ── */}
          <div className="sc-profile">
            <div className="sc-avatar">
              {teacher?.teacherName?.[0]?.toUpperCase() ?? "T"}
            </div>
            <div>
              <div className="sc-profile-tag">Faculty</div>
              <div className="sc-profile-name">
                {teacher?.teacherName ?? "Loading..."}
              </div>
              <div className="sc-profile-sub">
                {teacher?.teacherCode
                  ? `Code: ${teacher.teacherCode}`
                  : "No code"}
                {" · "}
                {classes.length} active {classes.length === 1 ? "class" : "classes"}
              </div>
            </div>
          </div>

          {/* ── SECTION HEADER ── */}
          <div className="sc-section-hd">
            <div className="sc-section-title">📖 My Classes</div>
            <button className="sc-btn" onClick={() => setShowModal(true)}>
              + New Class
            </button>
          </div>

          {/* ── CARD GRID ── */}
          <div className="sc-grid">
            {classes.length === 0 ? (
              <div className="sc-empty">No classes yet — create your first one!</div>
            ) : (
              classes.map((c, i) => (
                <div
                  key={c.classId}
                  className="sc-card"
                  onClick={() => navigate(`/faculty/class/${c.classId}`)}
                >
                  {/* Cover image */}
                  <div className="sc-card-cover">
                    <img
                      src={CARD_IMAGES[i % CARD_IMAGES.length]}
                      alt={c.subjectName}
                      loading="lazy"
                    />
                    <div className="sc-cover-overlay" />

                    {/* Code chip + student count overlaid on image */}
                    <div className="sc-cover-meta">
                      <span className="sc-code-chip">{c.classCode}</span>
                      <span className="sc-student-count">
                        👥 {c.studentCount} students
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="sc-card-body">
                    <div className="sc-card-name">{c.subjectName}</div>
                    <div className="sc-card-cta">
                      Manage projects &amp; student proposals →
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>

        {/* ── MODAL ── */}
        {showModal && (
          <div className="sc-overlay" onClick={() => setShowModal(false)}>
            <div className="sc-modal" onClick={e => e.stopPropagation()}>
              <button className="sc-modal-x" onClick={() => setShowModal(false)}>✕</button>
              <div className="sc-modal-title">Create New Class</div>

              <label className="sc-label">Subject Name</label>
              <input
                className="sc-input"
                placeholder="e.g. Data Structures"
                value={form.subjectName}
                onChange={e => setForm({ ...form, subjectName: e.target.value })}
              />

              <label className="sc-label">Class ID (entry key for students)</label>
              <input
                className="sc-input"
                placeholder="e.g. DS101"
                value={form.classCode}
                onChange={e => setForm({ ...form, classCode: e.target.value })}
              />

              <button className="sc-btn sc-modal-btn" onClick={handleCreateClass}>
                Create Class
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default FacultyDashboard;