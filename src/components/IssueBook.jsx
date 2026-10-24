import React, { useEffect, useState } from "react";
import { envData } from "../data";

const IssueBook = ({ onIssue, onClose, book }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all students when component loads
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/students`);
        const data = await response.json();

        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Search by name or roll number (Only Active Students)
  const filteredStudents = students.filter((student) => {
    // Exclude students who are not active
    if (student.status !== "Active") {
      return false;
    }

    const query = search.toLowerCase().trim();

    return (
      student.name?.toLowerCase().includes(query) ||
      String(student.rollNo ?? "")
        .toLowerCase()
        .includes(query)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    const availableCopy = book.copies.find((copy) => copy.available === true);

    if (!availableCopy) {
      alert("No copies of this book are available");
      return;
    }

    try {
      const response = await fetch(`${envData.apiUrl}/books-issued`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent.rollNo,
          bookId: availableCopy.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to issue book");
      }

      alert(data.message);

      // Pass the issued copy to the parent
      onIssue({
        ...book,
        issuedCopyId: availableCopy.id,
      });
    } catch (error) {
      console.error("Error issuing book:", error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
        <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl relative">
          
          {/* Close button for the modal */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <h2 className="mb-4 text-lg font-semibold">Issue Book</h2>

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium">
              Search Active Student
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedStudent(null);
              }}
              placeholder="Enter name or roll number"
              className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            {/* Student list */}
            <div className="mt-3 max-h-60 overflow-y-auto border border-gray-100 rounded bg-gray-50/50">
              {loading ? (
                <p className="p-3 text-sm text-gray-500">Loading active students...</p>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student._id || student.rollNo}
                    onClick={() => setSelectedStudent(student)}
                    className={`cursor-pointer border-b last:border-b-0 p-3 ${
                      selectedStudent?.rollNo === student.rollNo
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-100 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Roll No: {student.rollNo}
                    </p>
                  </div>
                ))
              ) : (
                !loading && (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    No active students found matching your search.
                  </p>
                )
              )}
            </div>

            {/* Selected student */}
            {selectedStudent && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Selected: <strong>{selectedStudent.name}</strong> ({selectedStudent.rollNo})</span>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedStudent(null);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={!selectedStudent}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Issue to Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;