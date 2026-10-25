import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { envData } from "../data";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("account"); // 'account' | 'catalog'
  
  // Account State
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  
  // Catalog State
  const [catalogBooks, setCatalogBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const LOAN_PERIOD_DAYS = 14;
  const FINE_PER_DAY = 10;

  useEffect(() => {
    const storedData = localStorage.getItem("studentData");
    if (!storedData) return navigate("/");
    
    const parsedStudent = JSON.parse(storedData);
    setStudent(parsedStudent);

    const fetchDashboardData = async () => {
      try {
        const [loansRes, booksRes] = await Promise.all([
          fetch(`${envData.apiUrl}/books-issued/student/${parsedStudent.rollNo}`),
          fetch(`${envData.apiUrl}/books`)
        ]);

        if (loansRes.ok) {
          const loansData = await loansRes.json();
          setBorrowedBooks(loansData.data);
        }

        if (booksRes.ok) {
          const booksData = await booksRes.json();
          // Group copies to show real-time shelf availability
          const grouped = booksData.reduce((acc, book) => {
            const key = `${book.title}-${book.author}`;
            if (!acc[key]) acc[key] = { ...book, total: 0, availableCount: 0 };
            acc[key].total += 1;
            if (book.available) acc[key].availableCount += 1;
            return acc;
          }, {});
          setCatalogBooks(Object.values(grouped));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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

  const filteredCatalog = catalogBooks.filter((book) => {
    const term = searchTerm.toLowerCase();
    if (filterType === "title") return book.title.toLowerCase().includes(term);
    if (filterType === "author") return book.author.toLowerCase().includes(term);
    if (filterType === "department") return book.department.toLowerCase().includes(term);
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.department.toLowerCase().includes(term)
    );
  });

  if (!student) return null;

  const activeLoans = borrowedBooks.filter(b => b.returnTime === null);
  const pastLoans = borrowedBooks.filter(b => b.returnTime !== null);
  const totalFines = activeLoans.reduce((total, book) => total + calculateLoanStatus(book.borrowTime).fineAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={process.env.PUBLIC_URL + "/logo192.jpeg"} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
          <h3 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500 hidden sm:block">
            Student Library Portal
          </h3>
        </div>
        <button onClick={() => { localStorage.removeItem("studentData"); navigate("/"); }} className="px-5 py-2.5 bg-rose-50 text-rose-700 text-sm font-semibold rounded-lg hover:bg-rose-100 transition-colors border border-rose-200">
          Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome, {student.name}</h2>
            <p className="text-slate-500 mt-1">{student.department} • {student.rollNo}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 text-center min-w-[120px]">
              <span className="block text-2xl font-bold text-violet-700">{activeLoans.length}</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-violet-600">Active Loans</span>
            </div>
            {totalFines > 0 && (
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-center min-w-[120px] animate-pulse">
                <span className="block text-2xl font-bold text-rose-700">₹{totalFines}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-600">Late Fees</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-slate-200/50 p-1.5 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab("account")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "account" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            My Account & Loans
          </button>
          <button 
            onClick={() => setActiveTab("catalog")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "catalog" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Browse Catalog
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 animate-pulse text-slate-500 font-medium">Loading library data...</div>
        ) : (
          <>
            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Loans
                    </h3>
                    {activeLoans.length === 0 && <p className="text-slate-500 italic bg-white p-6 rounded-xl border border-slate-200 text-center">No active loans.</p>}
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
                    {pastLoans.length === 0 && <p className="text-slate-500 italic bg-white p-6 rounded-xl border border-slate-200 text-center">No past borrowing history.</p>}
                    {pastLoans.map(book => (
                      <div key={book.id} className="bg-white p-5 mb-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-700">{book.bookTitle}</h4>
                        <div className="mt-3 flex flex-wrap justify-between items-center text-xs font-semibold gap-2">
                          <span className="text-slate-500">Issued: {new Date(book.borrowTime).toLocaleDateString()}</span>
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Returned: {new Date(book.returnTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CATALOG TAB */}
            {activeTab === "catalog" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col sm:flex-row gap-2 shadow-sm rounded-xl overflow-hidden border border-slate-200 focus-within:border-violet-500 focus-within:ring-4 ring-violet-500/10 transition-all bg-white p-2 mb-8">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-3 outline-none cursor-pointer">
                    <option value="all">All Fields</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="department">Genre/Dept</option>
                  </select>
                  <input type="text" placeholder="Search the library collection..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-3 px-4 outline-none text-slate-700 bg-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCatalog.map((book, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-violet-700 bg-violet-50 rounded-full border border-violet-100">{book.department}</span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{book.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">By {book.author}</p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm text-slate-600">Availability:</span>
                        <span className={`font-bold px-3 py-1 rounded-md text-sm ${book.availableCount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                          {book.availableCount} / {book.total}
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredCatalog.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-10 bg-white rounded-xl border border-slate-200">
                      No books found matching your search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;