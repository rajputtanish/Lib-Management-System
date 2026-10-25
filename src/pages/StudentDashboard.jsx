import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { envData } from "../data";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const LOAN_PERIOD_DAYS = 14;
  const FINE_PER_DAY = 10;

  useEffect(() => {
    const storedData = localStorage.getItem("studentData");
    if (!storedData) return navigate("/student-login");
    
    const parsedStudent = JSON.parse(storedData);
    setStudent(parsedStudent);

    const fetchMyBooks = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/books-issued/student/${parsedStudent.rollNo}`);
        const result = await response.json();
        if (response.ok) setBorrowedBooks(result.data);
      } catch (error) {
        console.error("Failed to load borrowed books:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBooks();
  }, [navigate]);

  const calculateLoanStatus = (borrowDateString) => {
    const borrowDate = new Date(borrowDateString);
    const dueDate = new Date(borrowDate.getTime() + LOAN_PERIOD_DAYS * 24 * 60 * 60 * 1000);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    const dueDateMidnight = new Date(dueDate);
    dueDateMidnight.setHours(0, 0, 0, 0);

    const isOverdue = today > dueDateMidnight;
    const diffTime = Math.abs(today - dueDateMidnight);
    const overdueDays = isOverdue ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    
    return { dueDate, isOverdue, overdueDays, fineAmount: overdueDays * FINE_PER_DAY };
  };

  if (!student) return null;

  const activeLoans = borrowedBooks.filter(b => b.returnTime === null);
  const pastLoans = borrowedBooks.filter(b => b.returnTime !== null);
  const totalFines = activeLoans.reduce((total, book) => total + calculateLoanStatus(book.borrowTime).fineAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-slate-200">
        <h3 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500">
          Self-Service Dashboard
        </h3>
        <button onClick={() => { localStorage.removeItem("studentData"); navigate("/"); }} className="px-5 py-2.5 bg-rose-100 text-rose-700 text-sm font-semibold rounded-lg hover:bg-rose-200 transition-colors">
          Logout
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome, {student.name}</h2>
            <p className="text-slate-500 mt-1">{student.department} • {student.rollNo}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 text-center min-w-[120px]">
              <span className="block text-2xl font-bold text-violet-700">{activeLoans.length}</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-violet-600">Active Check-outs</span>
            </div>
            {totalFines > 0 && (
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-center min-w-[120px] animate-pulse">
                <span className="block text-2xl font-bold text-rose-700">₹{totalFines}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-600">Late Fees</span>
              </div>
            )}
          </div>
        </div>

        {/* In-App Alerts */}
        {activeLoans.some(book => !calculateLoanStatus(book.borrowTime).isOverdue && Math.ceil((calculateLoanStatus(book.borrowTime).dueDate - new Date()) / (1000 * 3600 * 24)) <= 2) && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm mb-8 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="text-amber-800 font-bold">Action Required: Upcoming Due Dates</h4>
              <ul className="mt-1 space-y-1">
                {activeLoans.map(book => {
                  const { dueDate, isOverdue } = calculateLoanStatus(book.borrowTime);
                  const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 3600 * 24));
                  return (!isOverdue && daysUntilDue <= 2) ? (
                    <li key={book.id} className="text-amber-700 text-sm font-medium">
                      "{book.bookTitle}" is due {daysUntilDue <= 0 ? "TODAY" : daysUntilDue === 1 ? "tomorrow" : `in ${daysUntilDue} days`}.
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>
        )}

        {isLoading ? <div className="text-center py-10 animate-pulse">Loading data...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Loans
              </h3>
              {activeLoans.map(book => {
                const { dueDate, isOverdue, fineAmount } = calculateLoanStatus(book.borrowTime);
                return (
                  <div key={book.id} className={`bg-white p-5 mb-4 rounded-xl border shadow-sm ${isOverdue ? 'border-rose-200 bg-rose-50/30' : 'border-emerald-100'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{book.bookTitle}</h4>
                        <p className="text-sm text-slate-600 mt-1">By {book.bookAuthor}</p>
                      </div>
                      {isOverdue && <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded border border-rose-200">₹{fineAmount} Fine</span>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-end">
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">ID: {book.bookId}</span>
                      <div className="text-right">
                        <p className={`text-[10px] uppercase font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>{isOverdue ? 'Overdue Since' : 'Due Date'}</p>
                        <p className={`text-sm font-semibold ${isOverdue ? 'text-rose-700' : 'text-slate-700'}`}>{dueDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Historical Data
              </h3>
              {pastLoans.map(book => (
                <div key={book.id} className="bg-white p-5 mb-4 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-700">{book.bookTitle}</h4>
                  <div className="mt-3 flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-500">Issued: {new Date(book.borrowTime).toLocaleDateString()}</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Returned: {new Date(book.returnTime).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;