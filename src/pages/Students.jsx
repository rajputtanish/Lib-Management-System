import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { envData } from "../data";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isBooksLoading, setIsBooksLoading] = useState(false);

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

  const handleViewBooks = async (student) => {
    setSelectedStudent(student);
    setIsBooksLoading(true);

    try {
      const response = await fetch(`${envData.apiUrl}/books-issued/student/${student.rollNo}`);
      const result = await response.json();

      if (response.ok) {
        setBorrowedBooks(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      alert("Failed to load borrowed books details.");
    } finally {
      setIsBooksLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      deptFilter === "All" || student.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  const activeStudents = filteredStudents.filter((s) => s.status === "Active");
  const passoutStudents = filteredStudents.filter((s) => s.status !== "Active");

  const renderStudentTable = (title, dataList) => (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-slate-800 mb-4 pl-2 flex items-center gap-2">
        {title}
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {dataList.length}
        </span>
      </h3>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No.</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Active Loans</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataList.length > 0 ? (
              dataList
                .sort((a, b) => b.booksBorrowed - a.booksBorrowed)
                .map((student) => (
                  <tr key={student.rollNo} className="group hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 font-mono text-sm rounded-lg border border-gray-200">
                        {student.rollNo}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {student.department}
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${student.email}`} className="text-blue-500 hover:underline">
                        {student.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewBooks(student)}
                        className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold shadow-sm outline-none cursor-pointer hover:scale-110 transition-all ${
                          student.booksBorrowed > 0
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to view full borrowing history"
                      >
                        {student.booksBorrowed > 0 ? student.booksBorrowed : "0"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                        student.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-rose-100 text-rose-700 border border-rose-200"
                      }`}>
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${student.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                  <p className="text-md font-medium">No students found in this category.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans w-full relative">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Student Directory
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:flex-1 pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer text-gray-700"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Management">Management</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-10 space-x-2 animate-pulse">
              <p className="text-gray-500 font-medium">Loading student records...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm mb-6">
              <p className="text-red-700 font-semibold">⚠️ Error: {error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {filteredStudents.length === 0 ? (
                <div className="px-6 py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                  <p className="text-lg font-medium">No student records matched your search filters.</p>
                </div>
              ) : (
                <>
                  {renderStudentTable("🟢 Active Students", activeStudents)}
                  {renderStudentTable("🔴 Passout / Inactive Students", passoutStudents)}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Borrowed Books Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800 m-0">
                  📚 Library History for {selectedStudent.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
                  <span>Roll No: {selectedStudent.rollNo}</span>
                  <span>•</span>
                  <span>{selectedStudent.department}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              {isBooksLoading ? (
                <div className="flex justify-center items-center py-10">
                  <span className="text-slate-500 font-medium">Loading records...</span>
                </div>
              ) : borrowedBooks.length > 0 ? (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Currently Borrowed
                    </h4>
                    {borrowedBooks.filter(r => r.returnTime === null).length > 0 ? (
                      <div className="space-y-3">
                        {borrowedBooks.filter(r => r.returnTime === null).map((record) => (
                          <div key={record.id} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-slate-800 text-base m-0">{record.bookTitle}</h4>
                              <p className="text-sm text-slate-600 font-medium m-0 mt-1">By {record.bookAuthor}</p>
                              <span className="inline-block mt-3 text-xs font-bold px-2.5 py-1 bg-white text-slate-600 rounded-md border border-slate-200 font-mono">
                                ID: {record.bookId}
                              </span>
                            </div>
                            <div className="text-left sm:text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-emerald-100 pt-3 sm:pt-0 sm:pl-4">
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 m-0">Issued On</p>
                              <p className="text-sm font-semibold text-slate-800 m-0">
                                {new Date(record.borrowTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                        <p className="text-sm text-slate-500 italic m-0">No active book borrowed.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                      Past Records
                    </h4>
                    {borrowedBooks.filter(r => r.returnTime !== null).length > 0 ? (
                      <div className="space-y-3">
                        {borrowedBooks
                          .filter(r => r.returnTime !== null)
                          .sort((a, b) => new Date(b.returnTime) - new Date(a.returnTime))
                          .map((record) => (
                          <div key={record.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between gap-4 opacity-80 hover:opacity-100 transition-opacity">
                            <div>
                              <h4 className="font-bold text-slate-700 text-base m-0">{record.bookTitle}</h4>
                              <p className="text-sm text-slate-500 font-medium m-0 mt-1">By {record.bookAuthor}</p>
                              <span className="inline-block mt-3 text-xs font-bold px-2.5 py-1 bg-slate-50 text-slate-500 rounded-md border border-slate-100 font-mono">
                                ID: {record.bookId}
                              </span>
                            </div>
                            <div className="text-left sm:text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider m-0">Issued: {new Date(record.borrowTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
                              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1 m-0">Returned: {new Date(record.returnTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                        <p className="text-sm text-slate-500 italic m-0">No past borrowing history found.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-lg">No borrowing history found for this student.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;