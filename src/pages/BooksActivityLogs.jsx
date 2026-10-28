import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { envData } from "../data";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD from date picker
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/books-issued`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch transactions.");
        }

        const data = result.data || [];
        // Sort newest transactions first by borrowTime
        const sortedData = data.sort(
          (a, b) => new Date(b.borrowTime) - new Date(a.borrowTime)
        );
        setTransactions(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Converts a date string into local YYYY-MM-DD format to match <input type="date" />
  const toLocalDateInputString = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDuration = (borrowTime, returnTime) => {
    const start = new Date(borrowTime);
    const end = returnTime ? new Date(returnTime) : new Date();
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      days,
      isOverdue: !returnTime && days > 14,
      wasReturnedLate: returnTime && days > 14,
    };
  };

  const filteredTransactions = transactions.filter((item) => {
    const query = search.toLowerCase().trim();

    const formattedBorrowDate = formatDateTime(item.borrowTime).toLowerCase();
    const formattedReturnDate = item.returnTime
      ? formatDateTime(item.returnTime).toLowerCase()
      : "";
    const rawBorrowDate = toLocalDateInputString(item.borrowTime);
    const rawReturnDate = toLocalDateInputString(item.returnTime);

    // 1. Text Search (Book ID, Title, Author, Student Name, Roll No, or Formatted Date)
    const matchesSearch =
      String(item.bookId || "").toLowerCase().includes(query) ||
      String(item.bookTitle || "").toLowerCase().includes(query) ||
      String(item.bookAuthor || "").toLowerCase().includes(query) ||
      String(item.studentName || "").toLowerCase().includes(query) ||
      String(item.studentId || "").toLowerCase().includes(query) ||
      formattedBorrowDate.includes(query) ||
      formattedReturnDate.includes(query) ||
      rawBorrowDate.includes(query) ||
      rawReturnDate.includes(query);

    // 2. Status Filter
    const isReturned = item.returnTime !== null;
    const { isOverdue } = calculateDuration(item.borrowTime, item.returnTime);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Issued" && !isReturned) ||
      (statusFilter === "Returned" && isReturned) ||
      (statusFilter === "Overdue" && isOverdue);

    // 3. Date Picker Filter (Matches if either Issued Date OR Returned Date is on selectedDate)
    const matchesDate =
      !selectedDate ||
      rawBorrowDate === selectedDate ||
      rawReturnDate === selectedDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalCount = transactions.length;
  const activeCount = transactions.filter((t) => t.returnTime === null).length;
  const returnedCount = transactions.filter((t) => t.returnTime !== null).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans w-full">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto pt-16 md:pt-0">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold m-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Library Transactions
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium m-0">
                Complete history of all book issues, returns, and time durations
              </p>
            </div>

            {/* Quick Summary Pills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
                Total: {totalCount}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
                Active Loans: {activeCount}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                Returned: {returnedCount}
              </span>
            </div>
          </div>

          {/* Search, Date Picker & Status Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by Book ID, Title, Student, Roll No, or Date (e.g. 28 Oct)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Calendar Date Filter */}
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-48 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium cursor-pointer"
                  title="Filter transactions by Issued or Returned date"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate("")}
                    className="ml-2 px-3 py-3 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors shrink-0"
                    title="Clear date filter"
                  >
                    Clear Date ✕
                  </button>
                )}
              </div>

              {/* Status Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-52 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer text-slate-700 font-medium"
              >
                <option value="All">All Transactions</option>
                <option value="Issued">Currently Issued</option>
                <option value="Returned">Returned Books</option>
                <option value="Overdue">Overdue (&gt;14 Days)</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="text-center p-10 text-blue-600 font-medium animate-pulse">
              Loading transaction records...
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">
              ⚠️ Error: {error}
            </div>
          )}

          {/* Transactions Table */}
          {!isLoading && !error && (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Book ID
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Book Details
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Issued Date & Time
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Returned Date & Time
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Duration
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((record) => {
                      const isReturned = record.returnTime !== null;
                      const { days, isOverdue, wasReturnedLate } =
                        calculateDuration(record.borrowTime, record.returnTime);

                      return (
                        <tr
                          key={
                            record.id ||
                            `${record.bookId}-${record.borrowTime}`
                          }
                          className="hover:bg-blue-50/40 transition-colors"
                        >
                          {/* Book ID */}
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-md border border-slate-200">
                              {record.bookId}
                            </span>
                          </td>

                          {/* Book Title & Author */}
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800 m-0">
                              {record.bookTitle || "Untitled Book"}
                            </p>
                            {record.bookAuthor && (
                              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                                By {record.bookAuthor}
                              </p>
                            )}
                          </td>

                          {/* Student Name & Roll No */}
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800 m-0">
                              {record.studentName || "Student"}
                            </p>
                            <span className="inline-block mt-0.5 text-xs font-mono text-blue-600 font-semibold">
                              Roll No: {record.studentId}
                            </span>
                          </td>

                          {/* Issued Date */}
                          <td className="px-5 py-4 text-slate-700 font-medium">
                            {formatDateTime(record.borrowTime)}
                          </td>

                          {/* Returned Date */}
                          <td className="px-5 py-4 text-slate-700 font-medium">
                            {isReturned ? (
                              <span className="text-emerald-700 font-semibold">
                                {formatDateTime(record.returnTime)}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-xs">
                                Not returned yet
                              </span>
                            )}
                          </td>

                          {/* Duration */}
                          <td className="px-5 py-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                                isOverdue
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : wasReturnedLate
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {days} {days === 1 ? "day" : "days"}
                              {isOverdue && ` (${days - 14}d late)`}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="px-5 py-4 text-center">
                            {isReturned ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Returned
                              </span>
                            ) : isOverdue ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                Overdue
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Issued
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-slate-500 bg-slate-50/50"
                      >
                        <p className="text-base font-medium m-0">
                          No transaction records matched your search or date filter.
                        </p>
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

export default Transactions;