import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { envData } from "../data";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/students`);
        if (!response.ok) {
          throw new Error("Failed to fetch students from the server.");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Dynamic filter for search bar and department dropdown menu
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      deptFilter === "All" || student.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans w-full">
      <Sidebar />

      {/* Main Content Wrapper - Takes remaining space and enables scrolling */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {/* Animated Gradient Header */}
          <div className="flex items-center gap-3 mb-8 transform transition-all duration-500 hover:translate-x-2">
            <span className="text-4xl animate-bounce">🎓</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Student Directory
            </h2>
          </div>

          {/* Control Filters Panel */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, roll no, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md outline-none text-gray-700"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:shadow-md outline-none cursor-pointer text-gray-700 appearance-none"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="English Literature">English Literature</option>
              <option value="Physics">Physics</option>
              <option value="Social Sciences">Social Sciences</option>
            </select>
          </div>

          {/* Loading & Error States */}
          {isLoading && (
            <div className="flex justify-center items-center py-10 space-x-2 animate-pulse">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animation-delay-200"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animation-delay-400"></div>
              <p className="text-gray-500 font-medium ml-3">
                Loading student records...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm mb-6 animate-pulse">
              <p className="text-red-700 font-semibold">⚠️ Error: {error}</p>
            </div>
          )}

          {/* Main Responsive Data Table */}
          {!isLoading && !error && (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 mb-8">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Roll No.
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Email ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                      Borrowed Books
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                      Account Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents
                      .sort((a, b) => b.booksBorrowed - a.booksBorrowed)
                      .map((student) => (
                        <tr
                          key={student.rollNo}
                          className="group hover:bg-blue-50/50 transition-colors duration-300"
                        >
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 font-mono text-sm rounded-lg border border-gray-200 group-hover:bg-white group-hover:border-blue-200 transition-colors duration-300">
                              {student.rollNo}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-medium">
                            {student.department}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`mailto:${student.email}`}
                              className="text-blue-500 hover:text-blue-700 hover:underline transition-all duration-300"
                            >
                              {student.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {student.phone}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold transform transition-all duration-300 hover:scale-110 ${
                                student.booksBorrowed > 0
                                  ? "bg-amber-100 text-amber-700 shadow-sm shadow-amber-200"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {student.booksBorrowed}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                                student.status === "Active"
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-emerald-100"
                                  : "bg-rose-100 text-rose-700 border border-rose-200 shadow-rose-100"
                              }`}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${student.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                              ></span>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-16 text-center text-gray-500 bg-gray-50/50"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <svg
                            className="w-12 h-12 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <p className="text-lg font-medium">
                            No student records matched your search filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Students;
