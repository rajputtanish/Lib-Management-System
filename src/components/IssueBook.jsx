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

  // Search by name or roll number
  const filteredStudents = students.filter((student) => {
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
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">Issue Book</h2>

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium">
              Search Student
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedStudent(null);
              }}
              placeholder="Enter name or roll number"
              className="w-full rounded border p-2 outline-none focus:border-blue-500"
            />

            {/* Student list */}
            <div className="mt-3 max-h-60 overflow-y-auto">
              {loading ? (
                <p className="p-3 text-sm text-gray-500">Loading students...</p>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    onClick={() => setSelectedStudent(student)}
                    className={`cursor-pointer rounded border p-3 mb-2 ${
                      selectedStudent?._id === student._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">
                      Roll No: {student.rollNo}
                    </p>
                  </div>
                ))
              ) : (
                !loading && (
                  <p className="p-3 text-sm text-gray-500">
                    No students found.
                  </p>
                )
              )}
            </div>

            {/* Selected student */}
            {selectedStudent && (
              <p className="mt-3 text-sm text-green-700">
                Selected: {selectedStudent.name} ({selectedStudent.rollNo})
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedStudent(null);
                }}
                className="rounded border px-4 py-2"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={!selectedStudent}
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              >
                Select Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;
