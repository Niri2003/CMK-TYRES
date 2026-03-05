import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAcceptOrder = async (orderId, chosenDate) => {
    try {
      await axios.patch(`http://localhost:5000/api/update-status/${orderId}`, { 
        status: 'Accepted',
        confirmed_date: chosenDate 
      });
      fetchAllOrders(false); 
    } catch (error) {
      alert("Error accepting order");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/update-status/${orderId}`, { status: newStatus });
      fetchAllOrders(false);
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleAdminCancel = async (orderId) => {
    const reason = window.prompt("Enter reason for cancellation (User will see this):");
    if (reason === null) return; // User pressed cancel on prompt
    if (!reason.trim()) return alert("Reason is required to cancel.");

    try {
      await axios.patch(`http://localhost:5000/api/admin-cancel/${orderId}`, { reason });
      fetchAllOrders(false);
    } catch (error) {
      alert("Error cancelling order");
    }
  };

  useEffect(() => { fetchAllOrders(true); }, []);

  if (loading) return <div className="pt-40 text-center font-black text-[#0054a6] animate-pulse">LOADING LIVE BOOKINGS...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-10 uppercase tracking-tighter italic">Incoming <span className="text-[#0054a6]">Requests</span></h1>
      
      <div className="grid grid-cols-1 gap-6">
        {orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').map((order) => {
          const preferredDates = order.preferred_dates ? JSON.parse(order.preferred_dates) : [];
          return (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-50 text-[#0054a6] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">#{order.id}</span>
                    <span className="bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">{order.status}</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase leading-none mb-1">{order.customer_name}</h3>
                  <p className="text-gray-400 font-bold text-sm mb-6">{order.phone} | {order.branch}</p>

                  {/* USER REPORTED ISSUE - RESTORED */}
                  <div className="mb-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User Reported Issue</p>
                    <p className="text-sm font-bold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 italic">
                      "{order.problem_description || "No specific details provided by user."}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {JSON.parse(order.services).map((s, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Service</p>
                        <p className="text-xs font-bold text-gray-800 uppercase">{s.service || s.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-72 flex flex-col gap-4">
                  {order.status === 'Pending' ? (
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                      <p className="text-[10px] font-black text-[#0054a6] uppercase mb-4 text-center tracking-widest">Select to Confirm Date</p>
                      <div className="grid grid-cols-1 gap-2">
                        {preferredDates.map((date, idx) => (
                          <button key={idx} onClick={() => handleAcceptOrder(order.id, date)} className="bg-white border border-blue-200 py-3 rounded-xl text-xs font-black hover:bg-[#0054a6] hover:text-white transition-all shadow-sm">{date}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Confirmed for:</p>
                      <p className="text-2xl font-black text-gray-900">{order.service_date?.split('T')[0]}</p>
                      <button onClick={() => handleStatusChange(order.id, 'Completed')} className="mt-4 w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Finish Job</button>
                    </div>
                  )}
                  <button onClick={() => handleAdminCancel(order.id)} className="text-red-400 text-[10px] font-black uppercase hover:text-red-600">Cancel Booking</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;