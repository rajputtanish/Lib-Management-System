import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import IssueBook from "../components/IssueBook";
import { envData } from "../data";

function Books() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIssueBookForm, setShowIssueBookForm] = useState(null);

  // State to manage which modal form is currently visible
  const [activeForm, setActiveForm] = useState(null);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    department: "",
    quantity: 1,
  });

  const [returnBookId, setReturnBookId] = useState("");
  const [removeBookId, setRemoveBookId] = useState("");
  const [expandedBook, setExpandedBook] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/books`);
        if (!response.ok) {
          throw new Error("Failed to fetch books from the server.");
        }
        const data = await response.json();
        setInventory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.department ||
      newBook.quantity < 1
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await fetch(`${envData.apiUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      setInventory([...inventory, ...data.addedBooks]);
      setNewBook({ title: "", author: "", department: "", quantity: 1 });
      setActiveForm(null);
      alert(data.message);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleReturnBook = async (e) => {
    e.preventDefault();
    if (!returnBookId) {
      alert("Please enter a Book ID.");
      return;
    }

    const cleanId = returnBookId.trim();
    try {
      const response = await fetch(`${envData.apiUrl}/books-issued/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: cleanId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to return book");
      }

      // Update local inventory state using cleanId
      const updatedInventory = inventory.map((book) =>
        book.id === cleanId ? { ...book, available: true } : book
      );

      setInventory(updatedInventory);
      alert(`Book ${cleanId} successfully returned!`);

      setReturnBookId("");
      setActiveForm(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleRemoveBook = async (e) => {
    e.preventDefault();
    if (!removeBookId) {
      alert("Please enter at least one Book ID.");
      return;
    }

    const idsArray = removeBookId
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");

    try {
      const response = await fetch(`${envData.apiUrl}/books`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookIds: idsArray }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove books");
      }

      setInventory(inventory.filter((book) => !idsArray.includes(book.id)));

      alert(data.message);
      setRemoveBookId("");
      setActiveForm(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const groupedBooks = Object.values(
    inventory.reduce((acc, book) => {
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

  // Search by Title, Author, Department, OR Book ID
  const searchQuery = search.toLowerCase().trim();
  const filteredBooks = groupedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.department.toLowerCase().includes(searchQuery) ||
      book.copies.some((copy) =>
        String(copy.id || "").toLowerCase().includes(searchQuery)
      )
  );

  // Marks the exact issued copy ID as unavailable
  const handleBorrow = (bookGroup) => {
    const targetCopyId =
      bookGroup.issuedCopyId ||
      bookGroup.copies.find((c) => c.available)?.id;

    if (targetCopyId) {
      setInventory(
        inventory.map((item) =>
          item.id === targetCopyId ? { ...item, available: false } : item
        )
      );
    }

    setShowIssueBookForm(null);
  };

  const toggleExpand = (title) => {
    setExpandedBook(expandedBook === title ? null : title);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans w-full">
      <Sidebar />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto pt-16 md:pt-0">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-9 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Library Inventory Management
          </h2>

          {/* Action Buttons Container */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                activeForm === "add"
                  ? "bg-blue-700 text-white border-blue-700 ring-4 ring-blue-100"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
              }`}
              onClick={() =>
                setActiveForm(activeForm === "add" ? null : "add")
              }
            >
              {activeForm === "add" ? "Close Add Form" : "Add New Book"}
            </button>

            <button
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                activeForm === "return"
                  ? "bg-blue-700 text-white border-blue-700 ring-4 ring-blue-100"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
              }`}
              onClick={() =>
                setActiveForm(activeForm === "return" ? null : "return")
              }
            >
              {activeForm === "return" ? "Close Return Form" : "Return Book"}
            </button>

            <button
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                activeForm === "remove"
                  ? "bg-red-600 text-white border-red-600 ring-4 ring-red-100"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-red-600"
              }`}
              onClick={() =>
                setActiveForm(activeForm === "remove" ? null : "remove")
              }
            >
              {activeForm === "remove" ? "Close Remove Form" : "Remove Book"}
            </button>
          </div>

          {/* Conditionally Rendered Forms */}
          {activeForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-8 border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
                {/* Add Form Modal */}
                {activeForm === "add" && (
                  <>
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                      <h3 className="text-xl font-bold text-slate-800 mt-0">
                        Add New Book
                      </h3>
                      <button
                        onClick={() => setActiveForm(null)}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Close modal"
                      >
                        ✕
                      </button>
                    </div>
                    <form onSubmit={handleAddBook} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Book Title"
                        value={newBook.title}
                        onChange={(e) =>
                          setNewBook({ ...newBook, title: e.target.value })
                        }
                        required
                        className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={(e) =>
                          setNewBook({ ...newBook, author: e.target.value })
                        }
                        required
                        className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Department (e.g., Computer Science)"
                        value={newBook.department}
                        onChange={(e) =>
                          setNewBook({ ...newBook, department: e.target.value })
                        }
                        required
                        className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={newBook.quantity}
                          onChange={(e) =>
                            setNewBook({
                              ...newBook,
                              quantity: parseInt(e.target.value) || 1,
                            })
                          }
                          required
                          className="w-full sm:w-32 p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <button
                          type="submit"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Save to Inventory
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Return Form Modal */}
                {activeForm === "return" && (
                  <>
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                      <h3 className="text-xl font-bold text-slate-800 mt-0">
                        Return Book
                      </h3>
                      <button
                        onClick={() => setActiveForm(null)}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Close modal"
                      >
                        ✕
                      </button>
                    </div>
                    <form onSubmit={handleReturnBook} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Book ID"
                        value={returnBookId}
                        onChange={(e) => setReturnBookId(e.target.value)}
                        required
                        className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Return Book
                      </button>
                    </form>
                  </>
                )}

                {/* Remove Form Modal */}
                {activeForm === "remove" && (
                  <>
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-rose-100">
                      <h3 className="text-xl font-bold text-rose-800 mt-0 flex items-center gap-2">
                        ⚠️ Remove Book from Library
                      </h3>
                      <button
                        onClick={() => setActiveForm(null)}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Close modal"
                      >
                        ✕
                      </button>
                    </div>
                    <form onSubmit={handleRemoveBook} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter Book IDs separated by commas (e.g. BK-1234-A, BK-1234-B)"
                        value={removeBookId}
                        onChange={(e) => setRemoveBookId(e.target.value)}
                        required
                        className="w-full p-3.5 bg-white border border-rose-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Permanently Delete
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

          <hr className="border-t border-slate-200 my-10" />

          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 mt-0">
            📚 Library Collection
          </h2>

          {/* Search Input with Book ID Support */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by Book ID, title, author, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-5 bg-white border border-slate-300 rounded-2xl shadow-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {isLoading && (
            <div className="text-center p-8 text-blue-600 font-medium animate-pulse">
              Loading library inventory...
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">
              Error: {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {filteredBooks.map((book) => {
              const totalCopies = book.copies.length;
              const availableCopies = book.copies.filter((c) => c.available);
              const availableCount = availableCopies.length;

              // Auto-expand row if user searched by a matching Book ID
              const hasMatchingCopyId =
                searchQuery !== "" &&
                book.copies.some((c) =>
                  String(c.id || "").toLowerCase().includes(searchQuery)
                );
              const isExpanded =
                expandedBook === book.title || hasMatchingCopyId;

              return (
                <div
                  key={book.title}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Main Clickable Book Row */}
                  <div
                    onClick={() => toggleExpand(book.title)}
                    className="p-5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                  >
                    {/* Left Side: Title, Author, Department */}
                    <div className="flex items-start gap-3.5">
                      {/* Chevron Icon */}
                      <div
                        className={`mt-1 p-1.5 rounded-lg bg-slate-100 text-slate-500 transition-transform duration-200 ${
                          isExpanded
                            ? "rotate-180 bg-blue-100 text-blue-600"
                            : ""
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 m-0 group-hover:text-blue-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-0.5 mb-2 font-medium">
                          By {book.author}
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold tracking-wide">
                          🏢 {book.department}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Copies Count */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-sm text-slate-600 flex items-center gap-2">
                        <span>Remaining:</span>
                        <span className="font-medium bg-slate-100 px-2.5 py-1 rounded-md">
                          <strong
                            className={
                              availableCount > 0
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {availableCount}
                          </strong>{" "}
                          <span className="text-slate-400">/</span>{" "}
                          {totalCopies} copies
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Copies Drawer */}
                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 sm:px-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Individual Copies ({totalCopies})
                      </h4>

                      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-xs">
                        <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                          <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                              <th className="py-3 px-4">Book ID</th>
                              <th className="py-3 px-4">Book Name</th>
                              <th className="py-3 px-4">Author</th>
                              <th className="py-3 px-4">Department</th>
                              <th className="py-3 px-4 text-center">Status</th>
                              <th className="py-3 px-4 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {book.copies.map((copy) => {
                              const isIdMatch =
                                searchQuery !== "" &&
                                String(copy.id || "")
                                  .toLowerCase()
                                  .includes(searchQuery);

                              return (
                                <tr
                                  key={copy.id}
                                  className={`transition-colors ${
                                    isIdMatch
                                      ? "bg-blue-50/90"
                                      : "hover:bg-blue-50/40"
                                  }`}
                                >
                                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                                    <span
                                      className={`px-2.5 py-1 rounded-md border text-xs ${
                                        isIdMatch
                                          ? "bg-blue-600 text-white border-blue-600"
                                          : "bg-slate-100 border-slate-200"
                                      }`}
                                    >
                                      {copy.id}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 font-semibold text-slate-800">
                                    {book.title}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    {book.author}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                      {book.department}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                        copy.available
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          copy.available
                                            ? "bg-emerald-500"
                                            : "bg-amber-500"
                                        }`}
                                      />
                                      {copy.available ? "Available" : "Issued"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      onClick={() =>
                                        setShowIssueBookForm({
                                          ...book,
                                          copies: [copy], // Passes this exact copy to IssueBook
                                        })
                                      }
                                      disabled={!copy.available}
                                      className={`py-1.5 px-4 rounded-lg font-semibold text-xs transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 ${
                                        copy.available
                                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs focus:ring-blue-500 cursor-pointer"
                                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                      }`}
                                    >
                                      {copy.available
                                        ? "Borrow Copy"
                                        : "Issued Out"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showIssueBookForm && (
        <IssueBook
          onClose={() => setShowIssueBookForm(null)}
          book={showIssueBookForm}
          onIssue={handleBorrow}
        />
      )}
    </div>
  );
}

export default Books;