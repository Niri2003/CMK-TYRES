import React, { useEffect, useState } from 'react';
import axios from 'axios';
// 1. IMPORT THE UTILITY (Ensure the path is correct based on your folder structure)
import { generateInvoice } from '../utils/generateInvoice'; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/user-orders/${user.id}?t=${Date.now()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.patch(`http://localhost:5000/api/cancel-order/${orderId}`);
        fetchOrders();
      } catch (error) {
        alert("Error updating status");
      }
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <div className="pt-40 text-center font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading History...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-black text-gray-900 mb-10 uppercase tracking-tighter">
        Booking <span className="text-[#f37021]">History</span>
      </h1>

      <div className="space-y-8">
        {orders.length > 0 ? orders.map((order) => (
          <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-md">
            
            {/* Header Section: ID and Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50 pb-6">
              <div className="flex items-center gap-6">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ref ID</p>
                    <p className="font-mono font-black text-[#0054a6] text-xl">#CMK-{order.id}</p>
                 </div>
                 <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase border ${
                  order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                  order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 
                  order.status === 'Accepted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  'bg-green-50 text-green-600 border-green-200'
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Fee</p>
                <p className="text-3xl font-black text-gray-900 leading-none">₹{order.total_price}</p>
              </div>
            </div>

            {/* Content Section: Services and Problem Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Items Booked</p>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(order.services).map((item, index) => (
                    <span key={index} className="bg-orange-50 text-orange-700 text-[11px] font-black px-4 py-2 rounded-xl border border-orange-100 uppercase">
                      {item.service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Problem Description</p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 min-h-[60px]">
                   <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                    "{order.problem_description || "No additional details provided."}"
                   </p>
                </div>
              </div>
            </div>

            {/* Footer Section: Date and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">
                Scheduled for: <span className="text-gray-900">{order.service_date.split('T')[0]}</span> at <span className="text-gray-900">{order.branch}</span>
              </p>

              <div className="flex gap-3">
                {/* 2. DOWNLOAD INVOICE BUTTON: Only for 'Completed' */}
                {order.status === 'Completed' && (
                  <button 
                    onClick={() => generateInvoice(order)}
                    className="flex items-center gap-2 bg-[#0054a6] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all shadow-lg active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Invoice
                  </button>
                )}

                {/* CANCEL BUTTON: Only for 'Pending' or 'Accepted' */}
                {(order.status === 'Pending' || order.status === 'Accepted') && (
                  <button 
                    onClick={() => handleCancel(order.id)} 
                    className="bg-red-50 text-red-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Cancel Booking ✕
                  </button>
                )}
              </div>
            </div>

            {/* Admin Response Block */}
            {order.status === 'Cancelled' && order.notes && (
              <div className="mt-2 p-5 bg-[#0054a6] text-white rounded-[2rem] shadow-xl shadow-blue-100">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Message from Workshop:</p>
                <p className="text-lg font-black mt-2 leading-tight italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed text-gray-400 font-bold uppercase">
            No booking history found
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;