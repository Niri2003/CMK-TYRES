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
    date: '',
    problem: '' // RENAMED from 'notes' to 'problem' to avoid collision
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length === 0) {
      navigate('/cart');
    }
    setCartItems(savedCart);
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // LOGIC FIX: Flatten the object so the backend sees exactly what it expects
    const orderData = {
      userId: user.id,
      customer_name: user.name, 
      services: cartItems, // This gets stringified by the backend
      total_price: subtotal,
      phone: formData.phone,
      branch: formData.branch,
      service_date: formData.date,
      problem: formData.problem // This goes to 'problem_description' column
    };

    try {
      // Ensure the URL matches your server.js route
      const response = await axios.post('http://localhost:5000/api/book-service', orderData);
      
      if (response.status === 201) {
        alert("Booking Successful! Our team will contact you shortly.");
        localStorage.removeItem('cart'); 
        window.dispatchEvent(new Event("storage")); 
        navigate('/orders'); 
      }
    } catch (error) {
      console.error("Order Submission Error:", error);
      alert("Error placing order: " + (error.response?.data?.error || "Server connection failed"));
    }
  };

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <form onSubmit={handlePlaceOrder} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            Booking <span className="text-[#f37021]">Information</span>
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input disabled value={user?.name || ''} className="p-3 bg-gray-100 border rounded-xl font-medium text-gray-500 cursor-not-allowed" type="text" />
              <input disabled value={user?.email || ''} className="p-3 bg-gray-100 border rounded-xl font-medium text-gray-500 cursor-not-allowed" type="email" />
            </div>
            <input 
              required
              placeholder="Phone Number" 
              className="w-full p-3 border rounded-xl outline-none focus:border-[#f37021]" 
              type="tel" 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Preferred Branch</label>
                <select 
                  className="w-full p-3 border rounded-xl outline-none"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                >
                  <option value="Kottayam">Kottayam</option>
                  <option value="Manarcadu">Manarcadu</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Service Date</label>
                <input 
                  required
                  type="date" 
                  className="w-full p-3 border rounded-xl outline-none" 
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <textarea 
              placeholder="Any specific vehicle issues? (Optional)" 
              className="w-full p-3 border rounded-xl h-32 outline-none focus:border-[#f37021]"
              value={formData.problem}
              onChange={(e) => setFormData({...formData, problem: e.target.value})}
            ></textarea>
          </div>
        </div>

        {/* SUMMARY SIDEBAR */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit">
          <h2 className="text-xl font-black text-gray-900 mb-6 border-b pb-4 text-gray-400">Order Summary</h2>
          <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">{item.service}</span>
                <span className="font-bold text-gray-900">₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed pt-4 space-y-4">
            <div className="flex justify-between text-xl font-black text-gray-900">
              <span>Total Payable</span>
              <span className="text-[#f37021]">₹{subtotal}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Payment Method</p>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-4 border-[#0054a6]"></div>
                <span className="text-sm font-bold text-gray-700">Pay at Branch (Post-Service)</span>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#0054a6] text-white py-4 rounded-xl font-black text-lg shadow-xl hover:bg-blue-800 transition-all uppercase tracking-widest"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;