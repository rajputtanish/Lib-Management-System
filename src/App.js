import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PublicCatalog from "./pages/PublicCatalog";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";

function App() {
  return (
    <BrowserRouter basename="/Lib-Management-System">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicCatalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<Books />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
