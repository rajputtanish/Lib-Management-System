import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardActivityLog from "../components/DashboardActivityLog";

// Core mock summary numbers for the display metrics panel
const MOCK_STATS = [
  {
    title: "Total Library Books",
    count: "4,300",
    color: "#e3f2fd",
    textColor: "#0d47a1",
  },
  {
    title: "Registered Students",
    count: "755",
    color: "#e8f5e9",
    textColor: "#1b5e20",
  },
  {
    title: "Active Book Loans",
    count: "226",
    color: "#fff3e0",
    textColor: "#e65100",
  },
];

const DEPARTMENTS = [
  { name: "Computer Science" },
  { name: "English Literature" },
  { name: "Physics" },
  { name: "Social Sciences" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [departments] = useState(DEPARTMENTS);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "sans-serif",
        margin: 0,
      }}
    >
      {/* 1. PERMANENT APPLICATION SIDEBAR */}
      <Sidebar />

      {/* MAIN VIEW CONTROLLER WRAPPER */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f8fafc",
        }}
      >
        {/* 2. TOP NAVBAR WITH LOGOUT CONTAINER */}
        <header
          style={{
            height: "60px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
            boxSizing: "border-box",
          }}
        >
          <h2 className="m-0 text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">
            Library Management Dashboard
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-red-600 rounded-lg shadow-sm hover:bg-red-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
          >
            Logout
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </header>

        {/* 3. CORE CONTENT AREA GRID (WITH DEPT DISPLAY ON THE RIGHT SIDE) */}
        <main
          style={{
            padding: "30px",
            flex: 1,
            display: "flex",
            gap: "30px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT SUB-PANEL: Main Numerical Statistics Cards */}
          <div
            style={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {MOCK_STATS.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: stat.color,
                    color: stat.textColor,
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 5px 0",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {stat.title}
                  </p>
                  <h1 style={{ margin: 0, fontSize: "32px" }}>{stat.count}</h1>
                </div>
              ))}
            </div>

            {/* Quick placeholder block for additional analytical charts/logs */}
            <DashboardActivityLog />
          </div>

          {/* RIGHT SUB-PANEL: Dedicated Faculty/Department Column View */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              padding: "20px",
              borderRadius: "8px",
              height: "fit-content",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#0f172a",
                borderBottom: "2px solid #f1f5f9",
                paddingBottom: "8px",
              }}
            >
              🏢 Active Departments
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {departments.map((dept, index) => (
                <li
                  key={index}
                  style={{
                    padding: "10px 0",
                    borderBottom:
                      index !== departments.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    color: "#334155",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  🔹 {dept.name}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

// Global shared inline style config for the sidebar layout items

export default Dashboard;
