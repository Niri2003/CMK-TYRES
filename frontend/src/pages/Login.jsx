import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for smoother transitions
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      
      if (response.status === 200) {
        const userData = response.data.user;
        
        // 1. Save user object (including the new 'role' field) to storage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 2. Dispatch storage event to update Navbar immediately if needed
        window.dispatchEvent(new Event("storage"));

        // 3. STEP-BY-STEP REDIRECTION LOGIC
        if (userData.role === 'admin') {
          // If role is admin, send to Admin Dashboard
          window.location.replace('/admin-dashboard'); 
        } else {
          // If role is user, send to regular Profile/Dashboard
          window.location.replace('/profile'); 
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl font-medium uppercase text-[#0054a6]">Login</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-orange-500" 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-orange-500" 
        placeholder="Password" 
        required 
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer text-gray-500 hover:text-black">Forgot password?</p>
        <Link to="/signup" className="text-orange-600 font-bold">Create account</Link>
      </div>

      <button className="bg-gray-900 text-white px-8 py-2 mt-4 hover:bg-orange-600 transition-colors w-full rounded-lg font-bold">
        Sign In
      </button>
    </form>
  );
};

export default Login;