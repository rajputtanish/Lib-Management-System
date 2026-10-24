import React, { useState } from "react";
// Remove useNavigate import since logout is now handled in Sidebar
import Sidebar from "../components/Sidebar";
import DashboardActivityLog from "../components/DashboardActivityLog";
import DashboardStats from "../components/DashboardStats";

// const MOCK_STATS = [
//   {
//     title: "Total Library Books",
//     count: "4,300",
//     color: "#e3f2fd",
//     textColor: "#0d47a1",
//   },
//   {
//     title: "Registered Students",
//     count: "755",
//     color: "#e8f5e9",
//     textColor: "#1b5e20",
//   },
//   {
//     title: "Active Book Loans",
//     count: "226",
//     color: "#fff3e0",
//     textColor: "#e65100",
//   },
// ];

const DEPARTMENTS = [
  { name: "Computer Science" },
  { name: "English Literature" },
  { name: "Physics" },
  { name: "Social Sciences" },
];

function Dashboard() {
  const [departments] = useState(DEPARTMENTS);

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
        {/* Top Navbar - Cleaned up */}
        <header className="h-[60px] bg-white border-b border-slate-200 flex items-center px-4 sm:px-8 shrink-0 pl-16 md:pl-8">
          <h2 className="m-0 text-lg sm:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500 truncate">
            Dashboard
          </h2>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* LEFT SUB-PANEL */}
            <div className="flex-[3] flex flex-col gap-6">
              <DashboardStats />
              <DashboardActivityLog />
            </div>

            {/* RIGHT SUB-PANEL */}
            <div className="flex-1 bg-white border border-slate-200 p-5 rounded-xl h-fit shadow-sm">
              <h3 className="m-0 mb-4 text-slate-800 border-b-2 border-slate-100 pb-2 font-bold flex items-center gap-2">
                🏢 Active Departments
              </h3>
              <ul className="list-none p-0 m-0 space-y-1">
                {departments.map((dept, index) => (
                  <li
                    key={index}
                    className="py-2 border-b border-slate-50 last:border-0 text-slate-700 font-medium text-sm flex items-center gap-2"
                  >
                    <span className="text-blue-500">•</span> {dept.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
