import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PLaceOrder'
import Orders from './pages/Orders'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import AdminOrders from './pages/AdminOrders'
import Book from './pages/Book'
import AdminHistory from './pages/AdminHistory';
import AdminEarnings from './pages/AdminEarnings';
import AdminStatistics from './pages/AdminStatistics';  

const App = () => {
  const location = useLocation();
  // We pull the user from localStorage on every render to ensure 
  // protection reacts to login/logout immediately
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book" element={<Book />} />

          {/* User Specific Routes */}
          <Route path="/place-order" element={user ? <PlaceOrder /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          
          {/* Admin Protected Routes */}
          <Route 
            path="/admin-dashboard" 
            element={user?.role === 'admin' ? <AdminOrders /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin-history" 
            element={user?.role === 'admin' ? <AdminHistory /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin-earnings" 
            element={user?.role === 'admin' ? <AdminEarnings /> : <Navigate to="/login" />} 
          />
          {/* NEW STATISTICS ROUTE */}
          <Route 
            path="/admin-statistics" 
            element={user?.role === 'admin' ? <AdminStatistics /> : <Navigate to="/login" />} 
          />

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;