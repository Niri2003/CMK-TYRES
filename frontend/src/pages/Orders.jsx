import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { generateInvoice } from '../utils/generateInvoice'; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Cache-busting timestamp to ensure fresh data
      const response = await axios.get(`http://localhost:5000/api/user-orders/${user.id}?t=${Date.now()}`);
      
      // Sort by ID descending so newest is always at the top
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      
      setOrders(sortedData);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmMsg = "Emergency Cancellation: Are you sure? This may disrupt workshop scheduling.";
    if (!window.confirm(confirmMsg)) return;
    
    try {
      // Hits your dedicated user-cancel route in the backend
      await axios.patch(`http://localhost:5000/api/cancel-order/${orderId}`);
      alert("Booking Cancelled.");
      fetchOrders(); 
    } catch (error) {
      alert("Failed to cancel order.");
      console.error(error);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <div className="pt-40 text-center font-black text-gray-400 animate-pulse uppercase tracking-widest">Loading Your Garage...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-10 uppercase tracking-tighter italic">Service <span className="text-[#0054a6]">History</span></h1>
        
        <div className="space-y-6">
          {orders.length > 0 ? orders.map((order) => {
            let services = [];
            try {
              services = JSON.parse(order.services || '[]');
            } catch (e) { services = []; }
            
            return (
              <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Booking #{order.id}</span>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                        'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 uppercase mb-6 leading-none">
                      {services.map(s => s.title || s.service).join(" + ")}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-lg font-black text-gray-900">₹{order.total_price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Branch</p>
                        <p className="text-lg font-black text-gray-900">{order.branch}</p>
                      </div>
                      {order.service_date && (
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Service Date</p>
                          <p className="text-lg font-black text-gray-900">{new Date(order.service_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {order.notes && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Notes</p>
                        <p className="text-sm font-bold text-gray-700 italic">"{order.notes}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center items-end gap-3">
                    {/* INVOICE: Only for Completed */}
                    {order.status === 'Completed' && (
                      <button 
                        onClick={() => generateInvoice(order)} 
                        className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-[#0054a6] transition-all"
                      >
                        Download Invoice ⬇
                      </button>
                    )}

                    {/* UPDATED CANCEL LOGIC: Allows cancellation for both Pending AND Accepted */}
                    {(order.status === 'Pending' || order.status === 'Accepted') && (
                      <div className="text-right">
                        <button 
                          onClick={() => handleCancelOrder(order.id)} 
                          className="bg-white text-red-600 border border-red-200 px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                          Cancel Booking
                        </button>
                        {order.status === 'Accepted' && (
                           <p className="text-[9px] font-bold text-gray-400 uppercase mt-2 max-w-[200px]">
                             Note: This booking is already confirmed. Cancel only for emergencies.
                           </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed text-gray-300 font-black uppercase italic">Empty Garage</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;