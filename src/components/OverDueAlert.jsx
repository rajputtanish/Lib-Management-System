import React, { useState, useEffect } from "react";
import { envData } from "../data";

const OverdueAlerts = () => {
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/books-issued`);
        const result = await response.json();

        if (result.success && result.data) {
          // Filter for active loans only
          const activeLoans = result.data.filter(loan => loan.returnTime === null);
          
          const overdue = activeLoans.map(loan => {
            const borrowDate = new Date(loan.borrowTime);
            const today = new Date();
            // Calculate difference in days
            const diffTime = Math.abs(today - borrowDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return { ...loan, daysBorrowed: diffDays };
          }).filter(loan => loan.daysBorrowed > 14); // 14-day limit

          // Sort by most overdue first
          setOverdueLoans(overdue.sort((a, b) => b.daysBorrowed - a.daysBorrowed));
        }
      } catch (error) {
        console.error("Failed to fetch overdue alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverdueBooks();
  }, []);

  return (
    <div className="bg-white border border-rose-200 p-5 rounded-xl shadow-sm relative overflow-hidden">
      {/* Decorative background pulse */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-70"></div>
      
      <h3 className="m-0 mb-4 text-slate-800 border-b border-rose-100 pb-3 font-bold flex items-center justify-between">
        <span className="flex items-center gap-2">
          🚨 Overdue Alerts
        </span>
        <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {overdueLoans.length}
        </span>
      </h3>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-3">
          {[1, 2].map(i => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      ) : overdueLoans.length > 0 ? (
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {overdueLoans.map((loan, idx) => (
            <div key={idx} className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg flex justify-between items-center group hover:bg-rose-50 transition-colors">
              <div>
                <p className="font-semibold text-slate-800 text-sm m-0 truncate max-w-[150px] sm:max-w-[200px]">
                  {loan.bookTitle}
                </p>
                <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                  {loan.studentName} ({loan.studentId})
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-rose-600 font-bold text-sm">
                  {loan.daysBorrowed - 14} days late
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Total: {loan.daysBorrowed} days
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <span className="text-2xl block mb-2">✨</span>
          <p className="text-sm text-slate-500 font-medium m-0">All clear! No overdue books.</p>
        </div>
      )}
    </div>
  );
};

export default OverdueAlerts;