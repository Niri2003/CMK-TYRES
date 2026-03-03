import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Book = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [selection, setSelection] = useState({
    service: '',
    price: 0
  });

  // FULL SERVICE LIST: Re-added missing services
  const services = [
    { title: "Wheel Alignment", price: 800 },
    { title: "Wheel Balancing", price: 400 },
    { title: "Road Force Wheel Balancing", price: 1200 }, // Added back
    { title: "2 Wheeler Balancing", price: 300 },        // Added back
    { title: "Full Service", price: 5000 },
    { title: "Tyre Replacement", price: 12000 },
    { title: "Puncture Repair", price: 200 },
    { title: "Wheel Rotation", price: 200 },
    { title: "Road Assistance Support", price: 1000 }
  ];

  if (!user) {
    window.location.replace('/login');
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selection.service) return alert("Please select a service first.");

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const isAlreadyInCart = existingCart.find(item => item.service === selection.service);

    if (isAlreadyInCart) {
      alert(`"${selection.service}" is already in your cart.`);
      return;
    }

    const updatedCart = [...existingCart, { ...selection, id: Date.now() }];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    window.dispatchEvent(new Event("storage"));
    alert(`${selection.service} added!`);
  };

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              Service <span className="text-[#0054a6]">Booking</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
              CMK Tyres & Services • Premium Maintenance
            </p>
          </div>
          <button 
            onClick={() => navigate('/cart')}
            className="bg-white border border-gray-200 px-8 py-3 rounded-2xl text-[10px] font-black uppercase hover:border-[#0054a6] transition shadow-sm"
          >
            View My Selection 🛒
          </button>
        </div>

        {/* Responsive Grid for 9 services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <div 
              key={item.title}
              onClick={() => setSelection({ service: item.title, price: item.price })}
              className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between ${
                selection.service === item.title 
                ? 'border-[#0054a6] bg-blue-50/50 shadow-xl shadow-blue-100 translate-y-[-4px]' 
                : 'border-transparent bg-white hover:border-gray-100 shadow-sm'
              }`}
            >
              <div>
                <div className={`w-8 h-1 rounded-full mb-4 ${selection.service === item.title ? 'bg-[#0054a6]' : 'bg-gray-100'}`}></div>
                <h3 className="text-xl font-black text-gray-800 leading-tight">{item.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Professional Grade</p>
              </div>
              
              <div className="flex justify-between items-center mt-10">
                <p className="text-2xl font-black text-[#0054a6]">₹{item.price}</p>
                <span className={`text-xs font-black uppercase tracking-widest ${selection.service === item.title ? 'text-[#0054a6]' : 'text-gray-300'}`}>
                  {selection.service === item.title ? 'Selected' : 'Select'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ready to proceed?</p>
                <h2 className="text-2xl font-black text-gray-900">
                    {selection.service ? `ADD ${selection.service.toUpperCase()}` : 'SELECT A SERVICE ABOVE'}
                </h2>
            </div>
            <button 
                onClick={handleAddToCart}
                disabled={!selection.service}
                className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                selection.service 
                ? 'bg-[#0054a6] text-white hover:bg-black shadow-lg shadow-blue-100 scale-105 active:scale-95' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
            >
                Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
};

export default Book;