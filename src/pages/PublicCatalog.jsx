import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { envData } from "../data";

const PublicCatalog = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${envData.apiUrl}/books`);
        const data = await response.json();
        
        // Group individual copies by title to show accurate availability counts
        const grouped = data.reduce((acc, book) => {
          const key = `${book.title}-${book.author}`;
          if (!acc[key]) {
            acc[key] = { ...book, total: 0, availableCount: 0 };
          }
          acc[key].total += 1;
          if (book.available) acc[key].availableCount += 1;
          return acc;
        }, {});
        
        setBooks(Object.values(grouped));
      } catch (error) {
        console.error("Failed to fetch catalog", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter based on Title, Author, or Department
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar with Top-Right Login */}
      {/* Navbar with Top-Right Login */}
      <nav className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <img
            src={process.env.PUBLIC_URL + "/logo192.jpeg"}
            alt="Logo"
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
          <h3 className="text-xl sm:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">
            Disha Institute of Science and Technology
          </h3>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            Student Register
          </Link>
          <Link
            to="/student-login"
            className="px-4 py-2 bg-violet-50 text-violet-700 text-sm font-semibold rounded-lg hover:bg-violet-100 transition-colors border border-violet-200"
          >
            Student Login
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-md ml-2"
          >
            Staff Login
          </Link>
        </div>
      </nav>

      {/* Hero Search Section */}
      <header className="max-w-4xl mx-auto mt-12 mb-10 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Search the Catalog
        </h2>
        <p className="text-slate-500 mb-8">
          Find books by title, author, or subject to check real-time availability.
        </p>
        <div className="relative max-w-2xl mx-auto shadow-sm rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 ring-blue-500/10 transition-all">
          <input
            type="text"
            placeholder="Search for books, authors, or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 pl-12 pr-4 text-lg outline-none text-slate-700 bg-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
            🔍
          </span>
        </div>
      </header>

      {/* Results Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="text-center text-slate-500 py-10 animate-pulse">Loading catalog...</div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                    {book.department}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">By {book.author}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-600">Copies Available:</span>
                  <span
                    className={`font-bold px-3 py-1 rounded-md text-sm ${
                      book.availableCount > 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {book.availableCount} / {book.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <span className="text-4xl mb-4 block">😕</span>
            <h3 className="text-xl font-bold text-slate-800">No books found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicCatalog;