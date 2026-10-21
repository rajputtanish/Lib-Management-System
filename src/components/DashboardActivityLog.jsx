import React, { useEffect, useState } from "react";
import { envData } from "../data";

const DashboardActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/books-issued`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch activities");
        }

        const issuedBooks = result.data || [];

        // Create activity messages for issued and returned books
        const logs = [];

        issuedBooks.forEach((item) => {
          logs.push({
            id: `${item.id}-issued`,
            // Appended (ID: ${item.bookId}) to the message
            message: `${item.studentName || item.studentId} issued ${
              item.bookTitle || item.bookId
            } (ID: ${item.bookId})`,
            type: "issued",
            time: new Date(item.borrowTime),
          });

          if (item.returnTime) {
            logs.push({
              id: `${item.id}-returned`,
              // Appended (ID: ${item.bookId}) to the message
              message: `${item.studentName || item.studentId} returned ${
                item.bookTitle || item.bookId
              } (ID: ${item.bookId})`,
              type: "returned",
              time: new Date(item.returnTime),
            });
          }
        });

        // Latest activity first
        logs.sort((a, b) => b.time - a.time);

        setActivities(logs.slice(0, 10));
      } catch (error) {
        console.error("Error fetching activity log:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white border border-gray-200 p-6 md:p-7 rounded-2xl flex-1 flex flex-col h-full shadow-sm max-h-[500px]">
      {/* Header section */}
      <h4 className="text-gray-900 border-b border-slate-100 pb-4 mb-2 font-bold text-lg flex items-center gap-2 shrink-0">
        <span className="text-xl">📋</span> Activity Log
      </h4>

      {/* Dynamic Content Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <p className="text-slate-400 text-sm font-medium animate-pulse">
            Loading activities...
          </p>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <p className="text-slate-400 text-sm font-medium">
            No recent book transactions.
          </p>
        </div>
      ) : (
        <div className="flex flex-col overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2"
            >
              {/* Status Indicator Dot */}
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-sm ${
                  activity.type === "issued" ? "bg-blue-500" : "bg-green-500"
                }`}
              />

              {/* Activity Details */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-700 leading-snug">
                  {activity.message}
                </p>

                <p className="text-xs text-slate-400 mt-1.5 font-medium flex items-center gap-1">
                  <span className="text-[10px]">🕒</span>{" "}
                  {formatTime(activity.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardActivityLog;
