import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load items from local storage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // Function to remove a specific service from the cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    // Trigger navbar update
    window.dispatchEvent(new Event("storage"));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="pt-32 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">
          Service <span className="text-[#f37021]">Cart</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg font-medium mb-6">Your service cart is empty.</p>
            <button 
              onClick={() => navigate('/book')}
              className="bg-[#0054a6] text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all"
            >
              BROWSE SERVICES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* 1. LEFT SIDE: LIST OF SERVICES */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#f37021] font-bold">
                      🛠️
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.service}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Premium Maintenance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="font-black text-gray-900">₹{item.price}</span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-600 transition-colors text-xl font-light"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => navigate('/book')}
                className="text-sm font-bold text-[#0054a6] hover:text-orange-600 transition-colors flex items-center gap-2"
              >
                + Add more services
              </button>
            </div>

            {/* 2. RIGHT SIDE: PRICE SUMMARY */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 h-fit sticky top-32">
              <h2 className="text-xl font-black text-gray-900 mb-6 border-b pb-4">Price Details</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Tax</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t border-dashed pt-4 flex justify-between text-xl font-black text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-[#f37021]">₹{subtotal}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/place-order')}
                className="w-full bg-[#f37021] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-orange-700 transition-all uppercase tracking-widest"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-[10px] text-gray-400 text-center mt-4 font-medium italic">
                Secure checkout powered by C.M. Kurian & Co.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;