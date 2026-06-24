import { useState, useEffect } from "react";
import "../App.css";

function QuoteList() {
  // Added "date" to the mock data to test the date range filters[cite: 3]
  const quotes = [
    { id: "QT-2026-0001", customer: "John Smith", vehicle: "Toyota Corolla", total: "R1,250.00", status: "Draft", date: "2026-06-18" },
    { id: "QT-2026-0002", customer: "Sarah Jones", vehicle: "Ford Ranger", total: "R3,400.00", status: "Pending", date: "2026-06-19" },
    { id: "QT-2026-0003", customer: "Mike Brown", vehicle: "BMW 320", total: "R890.00", status: "Approved", date: "2026-06-20" },
    { id: "QT-2026-0004", customer: "Lisa White", vehicle: "VW Polo", total: "R2,100.00", status: "Rejected", date: "2026-06-21" },
    { id: "QT-2026-0005", customer: "David Black", vehicle: "Nissan Qashqai", total: "R4,550.00", status: "Draft", date: "2026-06-22" },
  ];

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Set to 3 so you can test pagination with 5 mock items

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, startDate, endDate]);

  // --- FILTERING LOGIC ---
  const filteredQuotes = quotes.filter((quote) => {
    // 1. Search by ID
    const matchesSearch = quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Filter by Status
    const matchesStatus = statusFilter === "All" || quote.status === statusFilter;
    
    // 3. Filter by Date Range
    const quoteDate = new Date(quote.date);
    const matchesStartDate = !startDate || quoteDate >= new Date(startDate);
    const matchesEndDate = !endDate || quoteDate <= new Date(endDate);

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Helper to assign correct CSS class based on status rules[cite: 3]
  const getStatusBadge = (status) => {
    switch (status) {
      case "Draft": return "badge badge-gray";
      case "Pending": return "badge badge-yellow";
      case "Approved": return "badge badge-green";
      case "Rejected": return "badge badge-red";
      default: return "badge badge-gray";
    }
  };

  const handleCreateNew = () => {
    console.log("Navigating to Create Quote Page...");
  };

  const handleView = (quoteId) => {
    console.log(`Navigating to Quote Detail page for ${quoteId}...`);
  };

  return (
    <div className="quote-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 className="quote-header" style={{ marginBottom: 0, borderBottom: "none" }}>Quotes</h1>
        <button className="btn btn-primary" onClick={handleCreateNew}>
          + Create New Quote
        </button>
      </div>

      {/* NEW: Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Search by Quote #</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g., QT-2026-0001" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select 
            className="form-control" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input 
            type="date" 
            className="form-control" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input 
            type="date" 
            className="form-control" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Quote Number</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((quote) => (
                <tr key={quote.id}>
                  <td><strong>{quote.id}</strong></td>
                  <td>{quote.customer}</td>
                  <td>{quote.vehicle}</td>
                  <td>{quote.date}</td>
                  <td>{quote.total}</td>
                  <td>
                    <span className={getStatusBadge(quote.status)}>
                      {quote.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button className="btn btn-secondary" onClick={() => handleView(quote.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                  No quotes found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* NEW: Pagination Controls */}
      {totalPages > 0 && (
        <div className="pagination-controls">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            className="btn btn-secondary" 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default QuoteList;