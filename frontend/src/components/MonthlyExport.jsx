import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const MonthlyExport = ({ allOrders }) => {
  // "0" represents "ALL MONTHS" for the year
  const [month, setMonth] = useState("0"); 
  const [year, setYear] = useState(new Date().getFullYear());

  const handleExport = () => {
    // Filter logic to handle both specific months and the "ALL" option
    const targetOrders = allOrders.filter(order => {
      // 1. Only include 'Completed' status
      if (order.status !== 'Completed' || !order.service_date) return false;
      
      const orderDate = new Date(order.service_date);
      const orderMonth = (orderDate.getMonth() + 1).toString();
      const orderYear = orderDate.getFullYear().toString();

      // 2. Logic: If month is "0", match only the year. 
      // If month is 1-12, match BOTH month and year.
      const monthMatch = (month === "0") || (orderMonth === month);
      const yearMatch = (orderYear === year.toString());

      return monthMatch && yearMatch;
    });

    if (targetOrders.length === 0) {
      alert(`No completed records found for ${month === "0" ? "the year" : "the month of"} ${year}.`);
      return;
    }

    // Transform data for Excel Columns
    const excelData = targetOrders.map(order => {
      let serviceNames = "Unknown Service";
      try {
        const parsed = typeof order.services === 'string' ? JSON.parse(order.services) : order.services;
        serviceNames = Array.isArray(parsed) 
          ? parsed.map(s => s.service || s.title).join(", ") 
          : "Format Error";
      } catch (e) { 
        console.error("Excel Parsing Error:", e); 
      }

      return {
        "Date": order.service_date.split('T')[0],
        "Customer Name": order.customer_name || "N/A",
        "Phone": order.phone || "N/A",
        "Services": serviceNames,
        "Total Revenue (INR)": parseFloat(order.total_price || 0)
      };
    });

    // Create Excel Workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set Column Widths (Visual Polish)
    worksheet['!cols'] = [
      { wch: 15 }, // Date
      { wch: 20 }, // Name
      { wch: 15 }, // Phone
      { wch: 45 }, // Services
      { wch: 18 }  // Revenue
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue_Data");
    
    // Dynamic Filename
    const fileName = month === "0" 
      ? `CMK_Full_Year_Report_${year}.xlsx` 
      : `CMK_Monthly_Report_Month${month}_${year}.xlsx`;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Financial Operations</p>
        <p className="text-sm font-black text-gray-900 uppercase">Generate Excel Ledger</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Month Selection */}
        <select 
          className="p-3 border rounded-xl font-bold text-xs outline-none focus:border-[#0054a6] bg-gray-50 cursor-pointer" 
          value={month} 
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="0">ALL MONTHS (FULL YEAR)</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {/* Year Selection */}
        <select 
          className="p-3 border rounded-xl font-bold text-xs outline-none focus:border-[#0054a6] bg-gray-50 cursor-pointer" 
          value={year} 
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        {/* Action Button */}
        <button 
          onClick={handleExport} 
          className="bg-[#0054a6] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default MonthlyExport;