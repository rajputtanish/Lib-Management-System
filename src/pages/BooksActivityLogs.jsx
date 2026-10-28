import React, { useEffect, useState } from "react";
import { envData } from "../data";
import Sidebar from "../components/Sidebar";

const BooksActiviyLogsPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${envData.apiUrl}/books-issued`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch activities");
      }

      const issuedBooks = result.data || [];
      const logs = [];

      issuedBooks.forEach((item) => {
        logs.push({
          id: `${item.id}-issued`,
          student: item.studentName || item.studentId,
          book: item.bookTitle || item.bookId,
          bookId: item.bookId,
          type: "issued",
          time: new Date(item.borrowTime),
        });

        if (item.returnTime) {
          logs.push({
            id: `${item.id}-returned`,
            student: item.studentName || item.studentId,
            book: item.bookTitle || item.bookId,
            bookId: item.bookId,
            type: "returned",
            time: new Date(item.returnTime),
          });
        }
      });

      logs.sort((a, b) => b.time - a.time);
      setActivities(logs);
    } catch (err) {
      console.error("Error fetching activity log:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatTime = (date) => {
    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const issuedCount = activities.filter(
    (activity) => activity.type === "issued",
  ).length;

  const returnedCount = activities.filter(
    (activity) => activity.type === "returned",
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Page Content */}
      <main
        className="h-screen        overflow-y-auto
        overflow-x-hidden        p-4
        pt-20        md:p-8
        md:pt-8        bg-slate-50 2xl:w-[90rem] lg:w-[80rem]"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Books Activity Logs
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Track all book issue and return transactions.
              </p>
            </div>

            <button
              onClick={fetchActivities}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white
                text-sm font-semibold hover:bg-blue-700
                disabled:opacity-50 transition-colors"
            >
              {loading ? "Refreshing..." : "↻ Refresh Logs"}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">
                Total Activities
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : activities.length}
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                All issue and return transactions
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">Books Issued</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {loading ? "—" : issuedCount}
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Total issue transactions
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">
                Books Returned
              </p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {loading ? "—" : returnedCount}
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Total return transactions
              </p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-gray-900">
                Transaction History
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Most recent activities appear first.
              </p>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 animate-pulse">
                Loading activities...
              </div>
            ) : error ? (
              <div className="py-20 px-4 text-center">
                <p className="text-red-500 font-medium">{error}</p>
                <button
                  onClick={fetchActivities}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : activities.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-4xl mb-3">📚</p>
                <p className="text-slate-600 font-semibold">
                  No activities found
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Book transactions will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Book Title</th>
                      <th className="px-6 py-4 font-semibold">Book ID</th>
                      <th className="px-6 py-4 font-semibold">Activity</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">
                        Date & Time
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {activities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {activity.student}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {activity.book}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {activity.bookId}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                              activity.type === "issued"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                activity.type === "issued"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            />
                            {activity.type === "issued" ? "Issued" : "Returned"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                          {formatTime(activity.time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && activities.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
                Showing {activities.length} activities
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BooksActiviyLogsPage;
