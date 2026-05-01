import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import ClassPage from "./pages/ClassPage";//student page
import FacultyDashboard from "./pages/FacultyDashboard";
import ClassDashboard from "./pages/ClassDashboard";//teacher page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/class/:classId" element={<ClassPage />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/class/:classId" element={<ClassDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
