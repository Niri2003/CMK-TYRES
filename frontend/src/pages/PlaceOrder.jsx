import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [cartItems, setCartItems] = useState([]);
  
  const [formData, setFormData] = useState({
    phone: '',
    branch: 'Kottayam',
    date1: '',
    date2: '',
    date3: '',
    problem: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length === 0) navigate('/cart');
    setCartItems(savedCart);
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    const dates = [formData.date1, formData.date2, formData.date3];
    if (new Set(dates).size !== dates.length) {
      alert("Please select three different dates to provide better options for the workshop.");
      return;
    }

    const orderData = {
      userId: user.id,
      customer_name: user.name, 
      customer_email: user.email,
      services: cartItems,
      total_price: subtotal,
      phone: formData.phone,
      branch: formData.branch,
      preferred_dates: JSON.stringify(dates), 
      problem: formData.problem 
    };

    try {
      const response = await axios.post('http://localhost:5000/api/book-service', orderData);
      if (response.status === 201) {
        alert("Booking Received! Admin will select one of your preferred dates.");
        localStorage.removeItem('cart'); 
        window.dispatchEvent(new Event("storage")); 
        navigate('/orders'); 
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || "Server failed"));
    }
  };

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <form onSubmit={handlePlaceOrder} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Booking <span className="text-[#0054a6]">Details</span>
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input disabled value={user?.name || ''} className="p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-400 cursor-not-allowed" type="text" />
              
              <input 
                required
                placeholder="Phone Number" 
                className="p-4 border border-gray-200 rounded-2xl outline-none focus:border-[#0054a6] font-bold" 
                type="tel"
                maxLength="10"
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={(e) => setFormData({
                  ...formData, 
                  phone: e.target.value.replace(/\D/g, '') // blocks non-numbers
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Branch</label>
              <select 
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none font-bold"
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
              >
                <option value="Kottayam">Kottayam (Main Hub)</option>
                <option value="Manarcadu">Manarcadu (Express)</option>
              </select>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <p className="text-[10px] font-black text-[#0054a6] uppercase tracking-widest">
                Preferred Service Dates (Provide 3 options)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input required type="date" className="p-3 border rounded-xl text-sm font-bold" onChange={(e) => setFormData({...formData, date1: e.target.value})} />
                <input required type="date" className="p-3 border rounded-xl text-sm font-bold" onChange={(e) => setFormData({...formData, date2: e.target.value})} />
                <input required type="date" className="p-3 border rounded-xl text-sm font-bold" onChange={(e) => setFormData({...formData, date3: e.target.value})} />
              </div>
              <p className="text-[10px] text-gray-400 italic">
                The admin will confirm one of these dates based on workshop availability.
              </p>
            </div>

            <textarea 
              placeholder="Any specific vehicle issues? (e.g., Brake noise, Engine light on)" 
              className="w-full p-4 border border-gray-200 rounded-2xl h-32 outline-none focus:border-[#0054a6] font-medium"
              value={formData.problem}
              onChange={(e) => setFormData({...formData, problem: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 h-fit sticky top-32">
          <h2 className="text-xl font-black text-gray-900 mb-6 border-b pb-4">Service Summary</h2>
          <div className="space-y-4 mb-8">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-500 font-bold text-sm uppercase">{item.service}</span>
                <span className="font-black text-gray-900">₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed pt-6">
            <div className="flex justify-between text-2xl font-black text-gray-900 mb-6">
              <span>Total</span>
              <span className="text-[#0054a6]">₹{subtotal}</span>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#0054a6] text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all uppercase tracking-widest active:scale-95"
            >
              Request Appointment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;