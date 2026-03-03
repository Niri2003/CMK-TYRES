import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  // State to capture input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Sending data to your Node.js backend on Port 5000
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password
      });

      if (response.status === 201) {
        alert("Account Created Successfully!");
        navigate('/login'); // Move to login page automatically
      }
    } catch (error) {
      // Display backend error message (e.g., "Email already registered")
      alert(error.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl font-medium">Sign Up</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800" 
        placeholder="Full Name" 
        required 
      />
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800" 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800" 
        placeholder="Password" 
        required 
      />

      <div className="w-full flex justify-end text-sm mt-[-8px]">
        <Link to="/login" className="cursor-pointer text-orange-600">Login Here</Link>
      </div>

      <button className="bg-black text-white px-8 py-2 mt-4 hover:bg-orange-600 transition-colors">
        Create Account
      </button>
    </form>
  );
};

export default Signup;