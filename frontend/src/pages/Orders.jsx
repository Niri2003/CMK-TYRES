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
      const response = await axios.get(`http://localhost:5000/api/user-orders/${user.id}?t=${Date.now()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <div className="pt-40 text-center font-black text-gray-400 animate-pulse uppercase tracking-widest">Loading Your Garage...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-10 uppercase tracking-tighter italic">Service <span className="text-[#f37021]">Garage</span></h1>
        
        <div className="grid grid-cols-1 gap-6">
          {orders.length > 0 ? orders.map((order) => {
            const services = JSON.parse(order.services);
            return (
              <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Booking #{order.id}</span>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>{order.status}</span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 uppercase mb-4">
                      {services.map(s => s.service || s.title).join(", ")}
                    </h3>

                    <div className="flex flex-wrap gap-6">
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Amount</p>
                          <p className="text-lg font-black text-gray-900 leading-none">₹{order.total_price}</p>
                       </div>
                       {order.service_date && (
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confirmed Date</p>
                          <p className="text-lg font-black text-gray-900">{order.service_date?.split('T')[0]}</p>
                        </div>
                      )}
                    </div>

                    {/* SHOW CANCELLATION REASON IF IT EXISTS */}
                    {order.status === 'Cancelled' && order.notes && (
                      <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Admin Feedback</p>
                        <p className="text-sm font-bold text-gray-700 italic">"{order.notes}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    {order.status === 'Completed' && (
                      <button onClick={() => generateInvoice(order)} className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-orange-600 transition-all flex items-center gap-2">Invoice ⬇</button>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed text-gray-300 font-black uppercase">No Bookings Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;