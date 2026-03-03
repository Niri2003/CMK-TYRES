import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEarnings = () => {
  const [stats, setStats] = useState({ total: 0, completedCount: 0, services: {} });
  const [loading, setLoading] = useState(true);

  const calculateEarnings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin-orders');
      const completed = response.data.filter(o => o.status === 'Completed');
      
      let totalRevenue = 0;
      let serviceData = {}; // Stores { "Service Name": { count: 0, revenue: 0 } }

      completed.forEach(order => {
        totalRevenue += parseFloat(order.total_price);
        
        // Safety check for JSON parsing
        const serviceList = typeof order.services === 'string' 
          ? JSON.parse(order.services) 
          : order.services;

        serviceList.forEach(s => {
          if (!serviceData[s.service]) {
            serviceData[s.service] = { count: 0, revenue: 0 };
          }
          serviceData[s.service].count += 1;
          serviceData[s.service].revenue += parseFloat(s.price || 0);
        });
      });

      setStats({ 
        total: totalRevenue, 
        completedCount: completed.length, 
        services: serviceData 
      });
    } catch (error) {
      console.error("Earnings Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { calculateEarnings(); }, []);

  if (loading) return (
    <div className="pt-40 text-center font-black text-[#0054a6] animate-pulse uppercase tracking-widest">
      Analyzing Financial Records...
    </div>
  );

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-10 text-center">
        Revenue <span className="text-[#0054a6]">Report</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Total Earnings Card */}
        <div className="bg-[#0054a6] p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-200 flex flex-col justify-center">
          <p className="text-xs font-black uppercase opacity-60 tracking-widest mb-2">Gross Revenue</p>
          <h2 className="text-6xl font-black">₹{stats.total.toLocaleString()}</h2>
          <p className="mt-4 font-bold opacity-80">{stats.completedCount} Total Completed Jobs</p>
        </div>

        {/* Service Breakdown List */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6 border-b pb-4">
            Earnings by Service Type
          </p>
          <div className="space-y-6">
            {Object.entries(stats.services).length > 0 ? (
              Object.entries(stats.services)
                .sort((a, b) => b[1].revenue - a[1].revenue) // Sort by highest earners
                .map(([name, data]) => (
                <div key={name} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-black text-gray-800 uppercase">{name}</p>
                      <p className="text-[10px] font-bold text-gray-400">{data.count} bookings</p>
                    </div>
                    <p className="text-xl font-black text-[#0054a6]">₹{data.revenue.toLocaleString()}</p>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0054a6] h-full transition-all duration-1000" 
                      style={{ width: `${(data.revenue / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 font-bold py-10">No completed data found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEarnings;