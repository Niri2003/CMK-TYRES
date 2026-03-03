import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchAllOrders = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true); 
      const response = await axios.get('http://localhost:5000/api/admin-orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/update-status/${orderId}`, { status: newStatus });
      fetchAllOrders(false); 
    } catch (error) {
      alert("Update failed");
    }
  };

  const handleAdminCancel = async (orderId) => {
    const msg = window.prompt("Enter cancellation reason:");
    if (msg !== null) {
      try {
        await axios.patch(`http://localhost:5000/api/admin-cancel/${orderId}`, { reason: msg });
        fetchAllOrders(false);
      } catch (error) {
        alert("Cancellation failed");
      }
    }
  };

  useEffect(() => { 
    fetchAllOrders(true); 
    const interval = setInterval(() => fetchAllOrders(false), 5000);
    return () => clearInterval(interval);
  }, []);

  // --- CRITICAL LOGIC CHANGE ---
  const activeOrders = orders.filter(order => {
    // 1. First, exclude Completed and Cancelled
    const isActive = order.status !== 'Completed' && order.status !== 'Cancelled';
    
    // 2. Then, apply date filter if selected
    if (!selectedDate) return isActive;
    const dbDate = order.service_date.includes('T') ? order.service_date.split('T')[0] : order.service_date;
    return isActive && dbDate === selectedDate;
  });

  if (loading) return <div className="pt-40 text-center font-black text-gray-400 animate-pulse">LOADING ACTIVE PIPELINE...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            Active <span className="text-[#0054a6]">Bookings</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Pending Actions & Live Jobs</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <input 
            type="date" 
            className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none text-sm font-bold focus:border-[#0054a6]"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {activeOrders.length > 0 ? activeOrders.map((order) => {
          const serviceList = typeof order.services === 'string' ? JSON.parse(order.services) : order.services;

          return (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-[#0054a6] transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono font-black text-[#0054a6] text-sm">#CMK-{order.id}</span>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                      order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 leading-none mb-4">{order.customer_name}</h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {serviceList.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase">
                        {item.service || item.title}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 font-bold uppercase">
                    {order.branch} • {order.service_date.split('T')[0]} • ₹{order.total_price}
                  </p>
                </div>

                <div className="flex gap-3 self-center">
                  {order.status === 'Pending' && (
                    <button onClick={() => handleStatusChange(order.id, 'Accepted')} className="bg-[#0054a6] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase hover:scale-105 transition">
                      Accept
                    </button>
                  )}
                  {order.status === 'Accepted' && (
                    <button onClick={() => handleStatusChange(order.id, 'Completed')} className="bg-green-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase hover:scale-105 transition">
                      Finish
                    </button>
                  )}
                  <button onClick={() => handleAdminCancel(order.id)} className="bg-red-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase hover:scale-105 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest">
            No active tasks found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;