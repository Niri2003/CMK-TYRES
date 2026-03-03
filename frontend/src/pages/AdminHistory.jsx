import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Import the fix we made earlier
import { generateInvoice } from '../utils/generateInvoice'; 

const AdminHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(''); // NEW STATE
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin-orders');
      const historyOnly = response.data.filter(o => o.status === 'Completed' || o.status === 'Cancelled');
      setOrders(historyOnly);
    } catch (error) {
      console.error("History Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // MASTER FILTER LOGIC: Search + Date
  const displayedOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toString().includes(searchTerm.replace('#CMK-', '')) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const orderDate = o.service_date.split('T')[0];
    const matchesDate = filterDate === '' || orderDate === filterDate;

    return matchesSearch && matchesDate;
  });

  if (loading) return <div className="pt-40 text-center font-black text-gray-400 animate-pulse uppercase tracking-widest">Accessing Archives...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            Order <span className="text-[#0054a6]">History</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Archived Bookings & Revenue</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="ID or Name..."
              className="w-full p-4 pl-12 rounded-2xl border border-gray-200 shadow-sm focus:border-[#0054a6] outline-none font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-4 opacity-30">🔍</span>
          </div>

          {/* Date Picker */}
          <div className="flex gap-2">
            <input 
              type="date" 
              className="p-4 rounded-2xl border border-gray-200 shadow-sm focus:border-[#0054a6] outline-none font-bold text-sm bg-white"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')}
                className="bg-red-50 text-red-500 px-4 rounded-2xl font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {displayedOrders.length > 0 ? displayedOrders.map((order) => (
          <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between lg:justify-start gap-3">
                  <span className="font-mono font-black text-[#0054a6] text-sm">#CMK-{order.id}</span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${
                    order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-none">{order.customer_name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase mt-1">{order.branch} • {order.service_date.split('T')[0]}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {JSON.parse(order.services).map((item, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase border border-gray-200">
                      {item.service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-[1.5] space-y-3 self-center">
                {order.status === 'Cancelled' && order.notes && (
                  <div className="bg-red-50 p-5 rounded-3xl border border-red-100">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Workshop Note</p>
                    <p className="text-sm text-red-700 font-bold italic">"{order.notes}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end lg:justify-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
                  <p className="text-3xl font-black text-gray-900 leading-none">₹{order.total_price}</p>
                </div>
                
                {/* INVOICE BUTTON FOR ADMIN AS WELL */}
                {order.status === 'Completed' && (
                  <button 
                    onClick={() => generateInvoice(order)}
                    className="bg-black text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0054a6] transition-all"
                  >
                    Download Copy
                  </button>
                )}
              </div>

            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest">
            No archived records found for these filters
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHistory;