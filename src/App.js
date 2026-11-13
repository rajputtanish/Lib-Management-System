import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import StudentPortal from "./pages/StudentPortal";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import ProtectedRoute from "./components/ProtectedRoute";
import BooksActiviyLogsPage from "./pages/BooksActivityLogs";

function App() {
  return (
    <BrowserRouter basename="/Lib-Management-System">
      <Routes>
        {/* 1. Student Portal opens first at "/" */}
        <Route path="/" element={<StudentPortal />} />

        {/* 2. Admin Login page opens at "/login" */}
        <Route path="/login" element={<Login />} />

        {/* 3. Protected Admin Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books-transactions"
          element={
            <ProtectedRoute>
              <BooksActiviyLogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;