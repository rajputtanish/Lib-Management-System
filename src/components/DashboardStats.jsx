import React, { useState, useEffect } from "react";
import { envData } from "../data";

const DashboardStats = () => {
  const [totalBooks, setTotalBooks] = useState("...");
  const [activeStudents, setActiveStudents] = useState("...");
  const [issuedBooks, setIssuedBooks] = useState("...");

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
          studentsData.filter((student) => student.status === "Active").length || 0
        );
        
        setIssuedBooks(
          issuedResult.data
            ? issuedResult.data.filter((issue) => issue.returnTime === null).length
            : 0
        );
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      <div
        style={{ backgroundColor: "#e3f2fd", color: "#0d47a1" }}
        className="p-5 rounded-xl shadow-sm"
      >
        <p className="m-0 mb-1 text-xs sm:text-sm uppercase tracking-wider font-semibold">
          Total Library Books
        </p>
        <h1 className="m-0 text-3xl sm:text-4xl font-bold">{totalBooks}</h1>
      </div>
      
      <div
        style={{ backgroundColor: "#e8f5e9", color: "#1b5e20" }}
        className="p-5 rounded-xl shadow-sm"
      >
        <p className="m-0 mb-1 text-xs sm:text-sm uppercase tracking-wider font-semibold">
          Total Active Students
        </p>
        <h1 className="m-0 text-3xl sm:text-4xl font-bold">{activeStudents}</h1>
      </div>
      
      <div
        style={{ backgroundColor: "#fff3e0", color: "#e65100" }}
        className="p-5 rounded-xl shadow-sm"
      >
        <p className="m-0 mb-1 text-xs sm:text-sm uppercase tracking-wider font-semibold">
          Currently Issued Books
        </p>
        <h1 className="m-0 text-3xl sm:text-4xl font-bold">{issuedBooks}</h1>
      </div>
    </div>
  );
};

export default DashboardStats;