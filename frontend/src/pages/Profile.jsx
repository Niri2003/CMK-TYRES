import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect if no user data is found
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 text-center px-4">
        <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mb-6 mt-2">Please sign in to access your customer dashboard.</p>
        <button 
          onClick={() => navigate('/login')} 
          className="bg-[#0054a6] text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg"
        >
          LOGIN
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-gray-50 min-h-screen">
      
      {/* 1. WELCOME SECTION */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Welcome back, <span className="text-[#f37021]">{user.name.split(' ')[0]}</span>
        </h1>
        <p className="text-gray-500 text-lg mt-3 font-medium">
          C.M. Kurian & Company — Your Trusted Partner in Mobility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 2. MAIN DASHBOARD AREA */}
        <div className="lg:col-span-2 space-y-8">
          {/* Booking Action Card */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            {/* Brand Accent Line */}
            <div className="absolute top-0 left-0 w-2 h-full bg-[#f37021]"></div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Schedule Your Next Service</h2>
              <p className="text-gray-500 leading-relaxed max-w-md">
                Keep your vehicle in top condition with professional wheel alignment, balancing, and expert care.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/book')}
              className="bg-[#0054a6] hover:bg-blue-800 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              BOOK NOW &rarr;
            </button>
          </div>

          {/* Activity Section */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Recent Service Activity
            </h3>
            <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-gray-400 font-medium">You have no upcoming appointments scheduled.</p>
            </div>
          </div>
        </div>

        {/* 3. ACCOUNT DETAILS SIDEBAR */}
        <div className="space-y-6 h-fit">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 mb-6">
              <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-4 shadow-xl">
                {user.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{user.email}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer ID</span>
                <span className="text-sm font-mono font-bold text-gray-700">#{user.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Status</span>
                <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">Verified</span>
              </div>
            </div>
          </div>

          {/* Contact Support Shortcut */}
          <div className="bg-gradient-to-br from-[#0054a6] to-[#003d7a] p-8 rounded-3xl text-white shadow-2xl">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p className="text-sm text-blue-100 mb-6 leading-relaxed">
              Our support team is available at Kottayam and Manarcad branches for roadside assistance.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className="w-full bg-white text-[#0054a6] py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
            >
              CONTACT BRANCH
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;