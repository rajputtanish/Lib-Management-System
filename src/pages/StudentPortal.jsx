import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { envData } from "../data";
import { Link } from "react-router-dom";

const FINE_PER_DAY = 5; // ₹5 per day after 14 days
const LOAN_LIMIT_DAYS = 14;

function StudentPortal() {
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" | "records"

  // Book Catalog States
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [expandedBook, setExpandedBook] = useState(null);

  // Student Record Lookup States
  const [rollNoInput, setRollNoInput] = useState("");
  const [studentProfile, setStudentProfile] = useState(null);
  const [studentRecords, setStudentRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");

  // Fetch all books on load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${envData.apiUrl}/books`);
        if (!res.ok) throw new Error("Failed to load library catalog");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setBooksLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Group books by title
  const groupedBooks = Object.values(
    books.reduce((acc, book) => {
      if (!acc[book.title]) {
        acc[book.title] = {
          title: book.title,
          author: book.author,
          department: book.department,
          copies: [],
        };
      }
      acc[book.title].copies.push({ id: book.id, available: book.available });
      return acc;
    }, {})
  );

  const filteredBooks = groupedBooks.filter((book) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.department.toLowerCase().includes(q) ||
      book.copies.some((c) => String(c.id || "").toLowerCase().includes(q));
    const matchesDept = deptFilter === "All" || book.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Calculate days and overdue fine
  const getLoanMetrics = (borrowTime, returnTime) => {
    const start = new Date(borrowTime);
    const end = returnTime ? new Date(returnTime) : new Date();
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    const overdueDays = Math.max(0, diffDays - LOAN_LIMIT_DAYS);
    const fine = overdueDays * FINE_PER_DAY;

    return {
      diffDays,
      overdueDays,
      fine,
      isOverdue: !returnTime && overdueDays > 0,
      wasReturnedLate: Boolean(returnTime && overdueDays > 0),
    };
  };

  // Handle Roll Number Search
  const handleCheckRecords = async (e) => {
    e.preventDefault();
    const cleanRoll = rollNoInput.trim();
    if (!cleanRoll) return;

    setRecordsLoading(true);
    setRecordsError("");
    setStudentProfile(null);
    setStudentRecords([]);

    try {
      const [studentsRes, issuedRes] = await Promise.all([
        fetch(`${envData.apiUrl}/students`),
        fetch(`${envData.apiUrl}/books-issued/student/${cleanRoll}`),
      ]);

      const studentsData = await studentsRes.json();
      const issuedResult = await issuedRes.json();

      const matchedStudent = Array.isArray(studentsData)
        ? studentsData.find(
            (s) => String(s.rollNo).toLowerCase() === cleanRoll.toLowerCase()
          )
        : null;

      if (!matchedStudent) {
        throw new Error(
          "No student found with that Roll Number. Please verify and try again."
        );
      }

      setStudentProfile(matchedStudent);
      setStudentRecords(issuedResult.data || []);
    } catch (err) {
      setRecordsError(err.message || "Unable to fetch student records.");
    } finally {
      setRecordsLoading(false);
    }
  };

  const activeLoans = studentRecords.filter((r) => r.returnTime === null);
  const pastLoans = studentRecords
    .filter((r) => r.returnTime !== null)
    .sort((a, b) => new Date(b.returnTime) - new Date(a.returnTime));

  // Total pending fine across currently borrowed overdue books
  const totalActiveFine = activeLoans.reduce((sum, loan) => {
    const { fine } = getLoanMetrics(loan.borrowTime, null);
    return sum + fine;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={process.env.PUBLIC_URL + "/logo192.jpeg"}
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white m-0 tracking-wide">
                Disha Institute Library
              </h1>
              <p className="text-xs text-cyan-400 m-0 font-medium">
                Student Self-Service Portal
              </p>
            </div>
          </div>

          <Link
  to="/login"
  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 border border-white/15 transition-all active:scale-95 cursor-pointer no-underline inline-flex items-center gap-2"
>
  🔐 Staff / Admin Login
</Link>
        </div>
      </header>

      {/* Hero Section & Tab Switcher */}
      <div className="bg-gradient-to-b from-slate-800/60 to-slate-900 border-b border-slate-800 px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 mb-2">
            Check Books, Borrowing History & Fines
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-6">
            Search live copy availability or enter your University Roll Number to
            inspect your library account.
          </p>

          <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "catalog"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📚 Browse Library Books
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "records"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🎓 My Records & Fines
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        {/* TAB 1: BOOK CATALOG */}
        {activeTab === "catalog" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by Book Title, Author, Department, or Book ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none"
              />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="sm:w-60 px-4 py-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:border-cyan-400 outline-none cursor-pointer"
              >
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Management">Management</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>

            {booksLoading ? (
              <div className="text-center py-12 text-cyan-400 animate-pulse font-medium">
                Loading live library inventory...
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-800 text-slate-400">
                No books matched your search criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBooks.map((book) => {
                  const total = book.copies.length;
                  const available = book.copies.filter((c) => c.available).length;
                  const isExpanded = expandedBook === book.title;

                  return (
                    <div
                      key={book.title}
                      className="rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-cyan-500/40 transition-all overflow-hidden"
                    >
                      <div
                        onClick={() =>
                          setExpandedBook(isExpanded ? null : book.title)
                        }
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div>
                          <h3 className="text-lg font-bold text-white m-0">
                            {book.title}
                          </h3>
                          <p className="text-sm text-slate-400 mt-0.5 mb-2">
                            By {book.author}
                          </p>
                          <span className="inline-block px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                            🏢 {book.department}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border ${
                              available > 0
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            }`}
                          >
                            {available > 0
                              ? `🟢 ${available} / ${total} Available`
                              : `🔴 Out of Stock (0 / ${total})`}
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-slate-900/70 border-t border-slate-700/70 px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Individual Copy Status
                          </p>
                          <div className="flex flex-wrap gap-2.5">
                            {book.copies.map((copy) => (
                              <div
                                key={copy.id}
                                className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
                                  copy.available
                                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                                    : "bg-amber-950/40 border-amber-500/30 text-amber-300"
                                }`}
                              >
                                <span>{copy.id}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30">
                                  {copy.available ? "Available" : "Issued"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STUDENT RECORDS & FINES */}
        {activeTab === "records" && (
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleCheckRecords}
              className="flex flex-col sm:flex-row gap-3 mb-8 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80"
            >
              <input
                type="text"
                placeholder="Enter your Roll Number (e.g. 254787230111)..."
                value={rollNoInput}
                onChange={(e) => setRollNoInput(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:border-cyan-400 outline-none font-mono"
              />
              <button
                type="submit"
                disabled={recordsLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {recordsLoading ? "Checking..." : "Check My Records"}
              </button>
            </form>

            {recordsError && (
              <div className="p-4 mb-6 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm text-center font-medium">
                ⚠️ {recordsError}
              </div>
            )}

            {studentProfile && (
              <div className="space-y-6">
                {/* Student Profile & Fine Summary Card */}
                <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl font-bold text-white m-0">
                        {studentProfile.name}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          studentProfile.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {studentProfile.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 mb-0 font-mono">
                      Roll No: {studentProfile.rollNo} •{" "}
                      {studentProfile.department}
                    </p>
                  </div>

                  {/* Fine Summary Box */}
                  <div
                    className={`px-5 py-3 rounded-xl border text-right ${
                      totalActiveFine > 0
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-200"
                        : "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-wider font-bold m-0 opacity-80">
                      Current Overdue Fine (₹{FINE_PER_DAY}/day after{" "}
                      {LOAN_LIMIT_DAYS}d)
                    </p>
                    <p className="text-2xl font-extrabold m-0 mt-0.5">
                      ₹{totalActiveFine}
                    </p>
                  </div>
                </div>

                {/* Currently Borrowed Books */}
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80">
                  <h4 className="text-base font-bold text-white mt-0 mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    Currently Issued Books ({activeLoans.length})
                  </h4>

                  {activeLoans.length === 0 ? (
                    <p className="text-sm text-slate-400 italic m-0">
                      You have no active books issued right now.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activeLoans.map((loan) => {
                        const { diffDays, overdueDays, fine, isOverdue } =
                          getLoanMetrics(loan.borrowTime, null);

                        return (
                          <div
                            key={loan.id}
                            className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between gap-4 ${
                              isOverdue
                                ? "bg-rose-950/30 border-rose-500/40"
                                : "bg-slate-900/60 border-slate-700"
                            }`}
                          >
                            <div>
                              <h5 className="font-bold text-white text-base m-0">
                                {loan.bookTitle}
                              </h5>
                              <p className="text-xs text-slate-400 m-0 mt-1">
                                By {loan.bookAuthor} •{" "}
                                <span className="font-mono text-cyan-300">
                                  ID: {loan.bookId}
                                </span>
                              </p>
                              <p className="text-xs text-slate-400 m-0 mt-2">
                                Issued on:{" "}
                                <strong className="text-slate-200">
                                  {new Date(loan.borrowTime).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </strong>{" "}
                                ({diffDays} days ago)
                              </p>
                            </div>

                            <div className="flex flex-col sm:items-end justify-center">
                              {isOverdue ? (
                                <>
                                  <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                                    🚨 Overdue by {overdueDays} days
                                  </span>
                                  <span className="text-base font-extrabold text-rose-400 mt-1.5">
                                    Fine: ₹{fine}
                                  </span>
                                </>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                                  ✓ Within 14-Day Limit ({14 - diffDays}d left)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Past Returned Records */}
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80">
                  <h4 className="text-base font-bold text-white mt-0 mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    Past Borrowing History ({pastLoans.length})
                  </h4>

                  {pastLoans.length === 0 ? (
                    <p className="text-sm text-slate-400 italic m-0">
                      No past returned books found for this Roll Number.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pastLoans.map((loan) => {
                        const { diffDays, overdueDays, fine, wasReturnedLate } =
                          getLoanMetrics(loan.borrowTime, loan.returnTime);

                        return (
                          <div
                            key={loan.id}
                            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row justify-between gap-4"
                          >
                            <div>
                              <h5 className="font-bold text-slate-200 text-sm m-0">
                                {loan.bookTitle}
                              </h5>
                              <p className="text-xs text-slate-400 m-0 mt-1">
                                By {loan.bookAuthor} •{" "}
                                <span className="font-mono">
                                  ID: {loan.bookId}
                                </span>
                              </p>
                            </div>

                            <div className="text-xs text-slate-400 sm:text-right space-y-1">
                              <p className="m-0">
                                Issued:{" "}
                                {new Date(loan.borrowTime).toLocaleDateString(
                                  "en-IN"
                                )}{" "}
                                • Returned:{" "}
                                {new Date(loan.returnTime).toLocaleDateString(
                                  "en-IN"
                                )}
                              </p>
                              <p className="m-0 font-semibold">
                                Duration: {diffDays} days{" "}
                                {wasReturnedLate ? (
                                  <span className="text-amber-400">
                                    (Late by {overdueDays}d • Fine: ₹{fine})
                                  </span>
                                ) : (
                                  <span className="text-emerald-400">
                                    (Returned on time)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentPortal;