import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { envData } from "../data";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("studentData");
    if (!storedData) {
      navigate("/student-login");
      return;
    }

    const parsedStudent = JSON.parse(storedData);
    setStudent(parsedStudent);

    const fetchMyBooks = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/books-issued/student/${parsedStudent.rollNo}`);
        const result = await response.json();
        if (response.ok) {
          setBorrowedBooks(result.data);
        }
      } catch (error) {
        console.error("Failed to load borrowed books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBooks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentData");
    navigate("/");
  };

  if (!student) return null;

  const activeLoans = borrowedBooks.filter(b => b.returnTime === null);
  const pastLoans = borrowedBooks.filter(b => b.returnTime !== null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-slate-200">
        <h3 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">
          Student Library Portal
        </h3>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-rose-100 text-rose-700 text-sm font-semibold rounded-lg hover:bg-rose-200 transition-colors"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome, {student.name}</h2>
            <p className="text-slate-500 mt-1">{student.department} • {student.rollNo}</p>
          </div>
          <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 text-center">
            <span className="block text-2xl font-bold text-violet-700">{activeLoans.length}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-violet-600">Active Loans</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-500 py-10 animate-pulse">Loading your library records...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Loans Column */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Currently Borrowed
              </h3>
              {activeLoans.length > 0 ? (
                <div className="space-y-4">
                  {activeLoans.map(book => (
                    <div key={book.id} className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                      <h4 className="font-bold text-slate-800 text-lg">{book.bookTitle}</h4>
                      <p className="text-sm text-slate-600 mt-1">By {book.bookAuthor}</p>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-mono bg-slate-50 px-2 py-1 rounded text-slate-500">ID: {book.bookId}</span>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Issued On</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {new Date(book.borrowTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-6 rounded-xl text-center text-slate-500">
                  You have no active book loans.
                </div>
              )}
            </div>

            {/* Past History Column */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                Past History
              </h3>
              {pastLoans.length > 0 ? (
                <div className="space-y-4">
                  {pastLoans.map(book => (
                    <div key={book.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                      <h4 className="font-bold text-slate-700">{book.bookTitle}</h4>
                      <div className="mt-3 flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-500">Issued: {new Date(book.borrowTime).toLocaleDateString()}</span>
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          Returned: {new Date(book.returnTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-6 rounded-xl text-center text-slate-500">
                  No past borrowing history.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;