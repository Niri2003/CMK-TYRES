import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets.js";
import profile_icon from '../assets/frontend_assets/profile_icon.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateNav = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
    };

    updateNav();
    window.addEventListener('storage', updateNav);
    return () => window.removeEventListener('storage', updateNav);
  }, [location]);

  const logout = () => {
    localStorage.clear();
    window.location.replace('/login');
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-50 px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo - Central anchor back to main dashboard/landing */}
        <NavLink to={user?.role === 'admin' ? "/admin-dashboard" : "/"}>
          <img src={assets.logo} className="w-52" alt="Logo" />
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-500">
          {user && user.role === 'admin' ? (
            <>
              <NavLink to="/admin-dashboard" className={({isActive})=>isActive?"text-[#0054a6] font-black border-b-2 border-[#0054a6] pb-1":"text-gray-500"}>DASHBOARD</NavLink>
              <NavLink to="/admin-history" className={({isActive})=>isActive?"text-[#0054a6] font-black border-b-2 border-[#0054a6] pb-1":"text-gray-500"}>HISTORY</NavLink>
              <NavLink to="/admin-earnings" className={({isActive})=>isActive?"text-[#0054a6] font-black border-b-2 border-[#0054a6] pb-1":"text-gray-500"}>EARNINGS</NavLink>
              {/* NEW STATISTICS TAB */}
              <NavLink to="/admin-statistics" className={({isActive})=>isActive?"text-[#0054a6] font-black border-b-2 border-[#0054a6] pb-1":"text-gray-500"}>STATISTICS</NavLink>
            </>
          ) : (
            <>
              {/* REPLACED HOME WITH PROFILE AS REQUESTED */}
              <NavLink to="/profile" className={({isActive})=>isActive?"text-orange-600 border-b-2 border-orange-600 pb-1":""}>PROFILE</NavLink>
              
              <NavLink to="/collection" className={({isActive})=>isActive?"text-orange-600 border-b-2 border-orange-600 pb-1":""}>SERVICES</NavLink>
              
              {user && (
                <NavLink to="/orders" className={({isActive})=>isActive?"text-orange-600 border-b-2 border-orange-600 pb-1":""}>ORDERS</NavLink>
              )}
              
              <NavLink to="/contact" className={({isActive})=>isActive?"text-orange-600 border-b-2 border-orange-600 pb-1":""}>CONTACT</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {user.role !== 'admin' && (
                <Link to="/cart" className="relative group">
                  <span className="text-2xl group-hover:text-orange-600 transition-colors">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              <div className="group relative">
                <img src={profile_icon} className="w-6 h-6 cursor-pointer rounded-full border border-gray-200" alt="Profile" />
                <div className="absolute right-0 hidden group-hover:block pt-4 w-44 z-50">
                  <div className="flex flex-col gap-2 py-4 px-5 bg-white border border-gray-100 rounded-xl shadow-2xl text-gray-600">
                    <p className="text-xs font-bold text-gray-400 border-b pb-2 uppercase tracking-tighter">
                      {user.role === 'admin' ? 'Administrator' : `Hi, ${user.name.split(' ')[0]}`}
                    </p>
                    
                    {user.role === 'admin' ? (
                      <>
                        <p onClick={() => navigate('/admin-dashboard')} className="cursor-pointer hover:text-[#0054a6] text-sm font-medium">Manage Orders</p>
                        <p onClick={() => navigate('/admin-statistics')} className="cursor-pointer hover:text-[#0054a6] text-sm font-medium">Business Stats</p>
                      </>
                    ) : (
                      <>
                        <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-orange-600 text-sm font-medium">My Profile</p>
                        <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-orange-600 text-sm font-medium">Booking History</p>
                      </>
                    )}
                    
                    <hr className="my-1 border-gray-50" />
                    <p onClick={logout} className="cursor-pointer hover:text-red-600 text-sm font-bold">Sign Out</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <NavLink to="/login" className="text-sm font-bold text-gray-700">LOGIN</NavLink>
               <NavLink to="/signup" className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-all">SIGN UP</NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;