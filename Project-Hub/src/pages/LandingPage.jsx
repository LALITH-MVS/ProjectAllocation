import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";

function LandingPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    regNo: "",
  });
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      let role = decoded.role;
      role = Array.isArray(role) ? role[0] : role;
      role = role.replace(/[\[\]]/g, "").replace("ROLE_", "").trim();
      if (role === "STUDENT") navigate("/student-dashboard");
      else if (role === "TEACHER") navigate("/faculty-dashboard");
      else alert("Unknown role");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  const handleSignup = async () => {
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.regNo) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      setSignupLoading(true);
      await API.post("/api/users/signup", {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        regNo: signupForm.regNo,
        role: "STUDENT",
      });
      alert("Account created! Please sign in.");
      setShowSignup(false);
      setSignupForm({ name: "", email: "", password: "", regNo: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Signup failed. Try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  const scrollToLogin = () =>
    document.getElementById("login-section").scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        * { box-sizing: border-box; }

        /* NAVBAR */
        .navbar-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 80px;
          border-bottom: 1px solid #e5e5e5;
          background: white;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .logo {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin: 0;
        }
        .logo span { color: #2f6d5e; }

        /* Hide Sign In button on small screens */
        .nav-signin-btn {
          display: inline-block;
        }
        @media (max-width: 576px) {
          .navbar-custom {
            padding: 14px 20px;
            justify-content: center;   /* center logo when button is gone */
          }
          .nav-signin-btn {
            display: none;
          }
          .logo { font-size: 20px; }
        }

        /* HERO */
        .hero-section { padding: 80px 0; }
        .hero-title { font-size: 48px; font-weight: 700; }
        .hero-title span { color: #2f6d5e; }
        .hero-text { margin-top: 15px; color: #6c757d; }
        .hero-btn {
          margin-top: 20px;
          background-color: #2f6d5e;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
        }
        .hero-img { border-radius: 12px; }

        @media (max-width: 576px) {
          .hero-section { padding: 40px 0 20px; }
          .hero-title { font-size: 32px; }
          /* Image shows below text on mobile (Bootstrap col stacks naturally) */
        }

        /* HOW IT WORKS */
        .section { padding: 60px 0; }
        .section-title { font-size: 32px; font-weight: bold; }
        .section-sub { color: #6c757d; margin-bottom: 30px; }

        @media (max-width: 576px) {
          .section { padding: 40px 0; }
          .section-title { font-size: 24px; }
        }

        /* CARDS */
        .card-custom {
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .card-custom img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .card-body-custom { padding: 20px; }
        .card-body-custom small { color: #999; font-size: 13px; }
        .card-body-custom h5 { margin: 6px 0 4px; font-weight: 700; }
        .card-body-custom p { color: #777; font-size: 14px; margin: 0; }

        /* LOGIN SECTION */
        .login-section {
          padding: 80px 0;
          display: flex;
          justify-content: center;
          background: #f5f5f4;
        }
        .login-card {
          background: white;
          padding: 36px 32px;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.09);
          text-align: center;
        }

        @media (max-width: 576px) {
          .login-section { padding: 40px 16px; }
          .login-card { padding: 28px 20px; }
        }

        .login-card input {
          width: 100%;
          padding: 11px 14px;
          margin: 8px 0;
          border-radius: 8px;
          border: 1.5px solid #e0dbd2;
          background: #faf9f7;
          font-size: 14px;
          font-family: inherit;
          outline: none;
        }
        .login-card input:focus {
          border-color: #2f6d5e;
          box-shadow: 0 0 0 3px rgba(47,109,94,0.1);
        }
        .login-btn {
          width: 100%;
          background: #2f6d5e;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          margin-top: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .login-btn:hover { background: #1e4f3e; }

        /* FOOTER */
        .footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid #e5e5e5;
          color: gray;
          font-size: 14px;
        }

        /* SIGNUP MODAL */
        .su-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.46);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }
        .su-modal {
          background: #fff;
          border-radius: 16px;
          padding: 36px 32px;
          width: 100%; max-width: 440px;
          position: relative;
          box-shadow: 0 28px 72px rgba(0,0,0,0.18);
          max-height: 90vh;
          overflow-y: auto;
        }
        @media (max-width: 480px) {
          .su-modal { padding: 28px 18px; }
        }
        .su-close {
          position: absolute; top: 14px; right: 16px;
          background: none; border: none;
          font-size: 18px; cursor: pointer; color: #aaa;
        }
        .su-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #555; margin-bottom: 5px; text-align: left;
        }
        .su-input {
          width: 100%; padding: 10px 12px;
          border: 1.5px solid #e0dbd2; border-radius: 8px;
          font-size: 14px; margin-bottom: 14px;
          background: #faf9f7; outline: none; font-family: inherit;
        }
        .su-input:focus { border-color: #2f6d5e; }
        .su-submit {
          width: 100%; background: #2f6d5e; color: #fff;
          border: none; border-radius: 8px;
          padding: 12px; font-size: 15px; font-weight: 600;
          cursor: pointer; margin-top: 4px; font-family: inherit;
        }
        .su-submit:hover { background: #1e4f3e; }
        .su-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div>
        {/* ── NAVBAR ── */}
        <nav className="navbar-custom">
          <h4 className="logo">
            <span>Project</span> Hub
          </h4>
          {/* Hidden on mobile via CSS */}
          <button className="btn btn-outline-secondary nav-signin-btn" onClick={scrollToLogin}>
            Sign in
          </button>
        </nav>

        {/* ── HERO ── */}
        <section className="container hero-section">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h1 className="hero-title">
                Project allocation,<br />
                <span>made simple.</span>
              </h1>
              <p className="hero-text">
                A quiet, focused tool for faculty and students to manage
                final-year projects together.
              </p>
              <button className="hero-btn" onClick={scrollToLogin}>
                Get started →
              </button>
            </div>
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                className="img-fluid hero-img"
                alt="students"
              />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="container section">
          <p className="text-uppercase text-muted small">How it works</p>
          <h2 className="section-title">
            From class registration to project approval — in three steps.
          </h2>
          <p className="section-sub">
            A workflow built around how departments run final-year projects.
          </p>
          <div className="row g-4">
            {[
              {
                num: "01",
                img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
                title: "Join your class",
                desc: "Enter Class ID shared by faculty.",
              },
              {
                num: "02",
                img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80",
                title: "Form teams & pick titles",
                desc: "Select project and create team.",
              },
              {
                num: "03",
                img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80",
                title: "Propose your own idea",
                desc: "Submit proposal and track approval.",
              },
            ].map((c) => (
              <div className="col-md-4" key={c.num}>
                <div className="card-custom">
                  <img src={c.img} alt="" />
                  <div className="card-body-custom">
                    <small>{c.num}</small>
                    <h5>{c.title}</h5>
                    <p>{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── LOGIN ── */}
        <section id="login-section" className="login-section">
          <div className="login-card">
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Welcome back</h3>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
              Sign in with your credentials.
            </p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" onClick={handleLogin}>
              Sign in
            </button>

            <p style={{ fontSize: 14, marginTop: 16, color: "#666" }}>
              New student?{" "}
              <span
                style={{ color: "#2f6d5e", cursor: "pointer", fontWeight: 600 }}
                onClick={() => setShowSignup(true)}
              >
                Create an account
              </span>
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">© 2026 Project Hub</footer>

        {/* ── SIGNUP MODAL ── */}
        {showSignup && (
          <div className="su-overlay" onClick={() => setShowSignup(false)}>
            <div className="su-modal" onClick={(e) => e.stopPropagation()}>
              <button className="su-close" onClick={() => setShowSignup(false)}>✕</button>

              <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Create account</h4>
              <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
                Student registration — faculty accounts are managed separately.
              </p>

              <label className="su-label">Full Name</label>
              <input
                className="su-input"
                placeholder="e.g. Jane Doe"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              />

              <label className="su-label">Email</label>
              <input
                className="su-input"
                type="email"
                placeholder="student@university.edu"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              />

              <label className="su-label">Registration No.</label>
              <input
                className="su-input"
                placeholder="e.g. 22CS216"
                value={signupForm.regNo}
                onChange={(e) => setSignupForm({ ...signupForm, regNo: e.target.value })}
              />

              <label className="su-label">Password</label>
              <input
                className="su-input"
                type="password"
                placeholder="Min. 6 characters"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              />

              <button
                className="su-submit"
                onClick={handleSignup}
                disabled={signupLoading}
              >
                {signupLoading ? "Creating account…" : "Sign up as Student"}
              </button>

              <p style={{ fontSize: 12, color: "#aaa", marginTop: 14, textAlign: "center" }}>
                Already have an account?{" "}
                <span
                  style={{ color: "#2f6d5e", cursor: "pointer" }}
                  onClick={() => setShowSignup(false)}
                >
                  Sign in
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LandingPage;