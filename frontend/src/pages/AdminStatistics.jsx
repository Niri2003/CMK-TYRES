import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title, // This is key for titles
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminStatistics = () => {
  const chartRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedService, setSelectedService] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin-orders');
        setOrders(res.data.filter(o => o.status === 'Completed'));
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const years = useMemo(() => {
    const yrs = orders.map(o => new Date(o.service_date).getFullYear().toString());
    return ['All', ...new Set(yrs)].sort().reverse();
  }, [orders]);

  const serviceOptions = useMemo(() => {
    const dynamicServices = new Set();
    orders.forEach(o => {
      try {
        const sList = typeof o.services === 'string' ? JSON.parse(o.services) : o.services;
        if (Array.isArray(sList)) {
          sList.forEach(s => {
            const name = s.service || s.title;
            if (name) dynamicServices.add(name);
          });
        }
      } catch (e) { console.error(e); }
    });
    dynamicServices.add("Road Assistance Support");
    return ['All', ...Array.from(dynamicServices).sort()];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const yearMatch = selectedYear === 'All' || new Date(o.service_date).getFullYear().toString() === selectedYear;
      let sList = [];
      try { sList = typeof o.services === 'string' ? JSON.parse(o.services) : o.services; } catch (e) { sList = []; }
      const serviceMatch = selectedService === 'All' || sList.some(s => (s.service === selectedService || s.title === selectedService));
      return yearMatch && serviceMatch;
    });
  }, [orders, selectedYear, selectedService]);

  const downloadChart = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const link = document.createElement('a');
    link.download = `Revenue_${selectedService}_${selectedYear}.jpg`;
    link.href = chart.toBase64Image('image/jpeg', 0.9);
    link.click();
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = {
    labels: months,
    datasets: [
      {
        label: `Monthly Revenue`,
        data: months.map((_, index) => {
          return filteredOrders
            .filter(o => new Date(o.service_date).getMonth() === index)
            .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
        }),
        backgroundColor: '#0054a6',
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      // NEW: Dynamic Title Configuration (This shows inside the JPG)
      title: {
        display: true,
        text: `Revenue Report: ${selectedService} (${selectedYear === 'All' ? 'All Time' : selectedYear})`,
        color: '#0f172a',
        font: {
          size: 18,
          weight: 'bold',
          family: 'Inter, system-ui'
        },
        padding: { top: 10, bottom: 30 }
      },
      tooltip: { backgroundColor: '#1e293b' },
      customCanvasBackgroundColor: { color: 'white' }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: '#f1f5f9' },
        title: { display: true, text: 'Earnings (₹)', font: { weight: 'bold' } }
      },
      x: { grid: { display: false } }
    }
  };

  const plugins = [{
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#ffffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  }];

  if (loading) return <div className="pt-40 text-center font-black animate-pulse text-slate-400">ANALYZING...</div>;

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-[#f8fafc] min-h-screen">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Business <span className="text-[#0054a6]">Analytics</span></h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Exportable Data Intelligence</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button 
            onClick={downloadChart}
            className="flex-1 lg:flex-none bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0054a6] transition-all shadow-lg"
          >
            Download JPG 📷
          </button>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-white border border-slate-200 p-3 rounded-xl font-bold text-xs shadow-sm outline-none focus:border-[#0054a6]">
            {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
          </select>

          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="bg-white border border-slate-200 p-3 rounded-xl font-bold text-xs shadow-sm outline-none focus:border-[#0054a6]">
            {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revenue</p>
          <p className="text-3xl font-black text-slate-900">₹{filteredOrders.reduce((s, o) => s + parseFloat(o.total_price || 0), 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Orders</p>
          <p className="text-3xl font-black text-slate-900">{filteredOrders.length}</p>
        </div>
        <div className="bg-[#0054a6] p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100">
          <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-2">Average</p>
          <p className="text-3xl font-black">₹{filteredOrders.length ? (filteredOrders.reduce((s, o) => s + parseFloat(o.total_price || 0), 0) / filteredOrders.length).toFixed(0) : 0}</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm mb-8">
        <div className="h-[500px]">
          <Bar ref={chartRef} data={chartData} options={chartOptions} plugins={plugins} />
        </div>
      </div>

    </div>
  );
};

export default AdminStatistics;