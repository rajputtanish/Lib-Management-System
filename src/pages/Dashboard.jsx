import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardActivityLog from "../components/DashboardActivityLog";
import { envData } from "../data";

const DEPARTMENTS = [
  { name: "Computer Science" }, { name: "English Literature" },
  { name: "Physics" }, { name: "Social Sciences" },
];

function Dashboard() {
  const [departments] = useState(DEPARTMENTS);
  
  // Initialize with loading placeholders
  const [stats, setStats] = useState([
    { title: "Total Library Books", count: "...", color: "#e3f2fd", textColor: "#0d47a1" },
    { title: "Registered Students", count: "...", color: "#e8f5e9", textColor: "#1b5e20" },
    { title: "Active Book Loans", count: "...", color: "#fff3e0", textColor: "#e65100" },
  ]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch all data concurrently for better performance
        const [booksRes, studentsRes, issuedRes] = await Promise.all([
          fetch(`${envData.apiUrl}/books`),
          fetch(`${envData.apiUrl}/students`),
          fetch(`${envData.apiUrl}/books-issued`),
        ]);

        const booksData = await booksRes.json();
        const studentsData = await studentsRes.json();
        const issuedResult = await issuedRes.json();

        // Calculate actual counts based on your backend response structures
        const totalBooksCount = booksData.length;
        const registeredStudentsCount = studentsData.length;
        
        // Filter issued books to only count those that haven't been returned
        const activeLoansCount = issuedResult.data
          ? issuedResult.data.filter(issue => issue.returnTime === null).length
          : 0;

        setStats([
          { title: "Total Library Books", count: totalBooksCount, color: "#e3f2fd", textColor: "#0d47a1" },
          { title: "Registered Students", count: registeredStudentsCount, color: "#e8f5e9", textColor: "#1b5e20" },
          { title: "Active Book Loans", count: activeLoansCount, color: "#fff3e0", textColor: "#e65100" },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
        {/* Top Navbar */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {stats.map((stat, i) => (
                  <div key={i} style={{ backgroundColor: stat.color, color: stat.textColor }} className="p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                    <p className="m-0 mb-1 text-xs sm:text-sm uppercase tracking-wider font-semibold">{stat.title}</p>
                    <h1 className="m-0 text-3xl sm:text-4xl font-bold">{stat.count}</h1>
                  </div>
                ))}
              </div>
              <DashboardActivityLog />
            </div>

            {/* RIGHT SUB-PANEL */}
            <div className="flex-1 bg-white border border-slate-200 p-5 rounded-xl h-fit shadow-sm">
              <h3 className="m-0 mb-4 text-slate-800 border-b-2 border-slate-100 pb-2 font-bold flex items-center gap-2">
                🏢 Active Departments
              </h3>
              <ul className="list-none p-0 m-0 space-y-1">
                {departments.map((dept, index) => (
                  <li key={index} className="py-2 border-b border-slate-50 last:border-0 text-slate-700 font-medium text-sm flex items-center gap-2">
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