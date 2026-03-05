import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { generateInvoice } from '../utils/generateInvoice'; 

const AdminHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(''); 
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin-orders');
      // Only show Completed or Cancelled in History
      const historyOnly = response.data.filter(o => o.status === 'Completed' || o.status === 'Cancelled');
      setOrders(historyOnly);
    } catch (error) {
      console.error("History Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const displayedOrders = orders.filter(o => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      (o.id && o.id.toString().includes(searchString)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(searchString));
    
    const matchesDate = filterDate === '' || (o.service_date && o.service_date.startsWith(filterDate));

    return matchesSearch && matchesDate;
  });

  if (loading) return <div className="pt-40 text-center font-black text-gray-400 animate-pulse uppercase tracking-widest">Accessing Archives...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Job <span className="text-[#0054a6]">History</span></h1>
            <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-widest">Archived Financial & Service Records</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search Name or ID..." 
              className="bg-white border border-gray-100 px-6 py-4 rounded-2xl text-sm font-bold shadow-sm focus:border-[#0054a6] outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input 
              type="date" 
              className="bg-white border border-gray-100 px-6 py-4 rounded-2xl text-sm font-bold shadow-sm focus:border-[#0054a6] outline-none"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayedOrders.length > 0 ? displayedOrders.map((order) => {
          const services = JSON.parse(order.services);
          return (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black uppercase text-gray-300">#CMK-{order.id}</span>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>{order.status}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase">{order.service_date?.split('T')[0]}</span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 uppercase mb-4">{order.customer_name}</h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {services.map((s, i) => (
                      <span key={i} className="bg-gray-50 px-3 py-1 rounded-lg text-[10px] font-bold text-gray-500 border border-gray-100 uppercase">
                        {s.service || s.title}
                      </span>
                    ))}
                  </div>

                  {/* RESTORED: User Problem Description */}
                  <div className="mb-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">User's Issue</p>
                    <p className="text-xs font-bold text-gray-600 italic bg-gray-50 p-3 rounded-xl border border-gray-100 inline-block min-w-[200px]">
                      "{order.problem_description || "No description provided"}"
                    </p>
                  </div>

                  {/* RESTORED: Admin Cancellation Notes */}
                  {order.status === 'Cancelled' && order.notes && (
                    <div className="mt-4">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Workshop Note (Cancel Reason)</p>
                      <p className="text-sm text-red-700 font-bold italic">"{order.notes}"</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-10">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                    <p className="text-3xl font-black text-gray-900 leading-none">₹{order.total_price}</p>
                  </div>
                  
                  {order.status === 'Completed' && (
                    <button 
                      onClick={() => generateInvoice(order)}
                      className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0054a6] transition-all shadow-lg active:scale-95"
                    >
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest">
            No archived records found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHistory;