import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

// Existing Staff & Public Components
import Login from "./pages/Login"; // Staff login
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard"; // Staff dashboard
import Students from "./pages/Students";
import PublicCatalog from "./pages/PublicCatalog";

// New Student Components
import StudentRegistration from "./pages/StudentRegistration";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter basename="/Lib-Management-System">
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<PublicCatalog />} />

        {/* Student Routes */}
        <Route path="/register" element={<StudentRegistration />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Staff Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;