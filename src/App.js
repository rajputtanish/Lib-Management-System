import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

// import HomeLogin from "./pages/HomeLogin";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
// import StudentRegistration from "./pages/StudentRegistration";
// import StudentLogin from "./pages/StudentLogin";
// import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter basename="/Lib-Management-System">
      <Routes>
        {/* Landing Route */}
        {/* <Route path="/" element={<HomeLogin />} /> */}

        {/* Student Routes */}
        {/* <Route path="/register" element={<StudentRegistration />} /> */}
        {/* <Route path="/student-login" element={<StudentLogin />} /> */}
        {/* <Route path="/student-dashboard" element={<StudentDashboard />} /> */}

        {/* Staff Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
