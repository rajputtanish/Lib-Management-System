import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { envData } from "../data";

const DashboardStats = () => {
  const navigate = useNavigate();

  const [totalBooks, setTotalBooks] = useState("...");
  const [activeStudents, setActiveStudents] = useState("...");
  const [issuedBooks, setIssuedBooks] = useState("...");

  // Currently Issued Books Modal State
  const [activeIssuedList, setActiveIssuedList] = useState([]);
  const [showIssuedModal, setShowIssuedModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, studentsRes, issuedRes] = await Promise.all([
          fetch(`${envData.apiUrl}/books`),
          fetch(`${envData.apiUrl}/students`),
          fetch(`${envData.apiUrl}/books-issued`),
        ]);

        const booksData = await booksRes.json();
        const studentsData = await studentsRes.json();
        const issuedResult = await issuedRes.json();

        setTotalBooks(booksData.length || 0);

        setActiveStudents(
          Array.isArray(studentsData)
            ? studentsData.filter((student) => student.status === "Active")
                .length
            : 0
        );

        const currentlyIssued = issuedResult.data
          ? issuedResult.data.filter((issue) => issue.returnTime === null)
          : [];

        setIssuedBooks(currentlyIssued.length);
        setActiveIssuedList(
          currentlyIssued.sort(
            (a, b) => new Date(b.borrowTime) - new Date(a.borrowTime)
          )
        );
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {/* Clickable Total Library Books Card -> Navigates to /books */}
        <div
          onClick={() => navigate("/books")}
          style={{ backgroundColor: "#e3f2fd", color: "#0d47a1" }}
          className="p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 select-none flex flex-col justify-between"
          title="Click to open Books Collection page"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="m-0 text-xs sm:text-sm uppercase tracking-wider font-semibold">
                Total Library Books
              </p>
            </div>
            <h1 className="m-0 text-3xl sm:text-4xl font-bold">{totalBooks}</h1>
          </div>
        </div>

        {/* Clickable Total Active Students Card -> Navigates to /students */}
        <div
          onClick={() => navigate("/students")}
          style={{ backgroundColor: "#e8f5e9", color: "#1b5e20" }}
          className="p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 select-none flex flex-col justify-between"
          title="Click to open Student Directory page"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="m-0 text-xs sm:text-sm uppercase tracking-wider font-semibold">
                Total Active Students
              </p>
            </div>
            <h1 className="m-0 text-3xl sm:text-4xl font-bold">
              {activeStudents}
            </h1>
          </div>
        </div>

        {/* Clickable Currently Issued Books Box -> Opens Popup Modal */}
        <div
          onClick={() => setShowIssuedModal(true)}
          style={{ backgroundColor: "#fff3e0", color: "#e65100" }}
          className="p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 select-none flex flex-col justify-between"
          title="Click to view all currently issued books"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="m-0 text-xs sm:text-sm uppercase tracking-wider font-semibold">
                Currently Issued Books
              </p>
            </div>
            <h1 className="m-0 text-3xl sm:text-4xl font-bold">
              {issuedBooks}
            </h1>
          </div>
        </div>
      </div>

      {/* Currently Issued Books Popup Modal */}
      {showIssuedModal && (
        <div
          onClick={() => setShowIssuedModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-orange-50/60">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 m-0">
                    Currently Issued Books
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium m-0">
                    Showing all {activeIssuedList.length} active library issued books.....
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIssuedModal(false)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors outline-none"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-3">
              {activeIssuedList.length > 0 ? (
                activeIssuedList.map((record) => (
                  <div
                    key={record.id || `${record.bookId}-${record.borrowTime}`}
                    className="p-4 rounded-xl border border-orange-100 bg-orange-50/20 hover:bg-orange-50/50 transition-colors flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 text-base m-0">
                        {record.bookTitle || "Untitled Book"}
                      </h4>
                      {record.bookAuthor && (
                        <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                          By {record.bookAuthor}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs font-bold px-2.5 py-1 bg-white text-slate-700 rounded-md border border-slate-200 font-mono">
                          Book ID: {record.bookId}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                          🎓 {record.studentName || "Student"} (
                          {record.studentId})
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-orange-100 pt-3 sm:pt-0 sm:pl-4 shrink-0">
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 m-0">
                        Issued On
                      </p>
                      <p className="text-sm font-semibold text-slate-800 m-0">
                        {new Date(record.borrowTime).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <span className="text-3xl block mb-2">✨</span>
                  <p className="text-slate-500 font-medium m-0">
                    No books are currently issued out.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardStats;