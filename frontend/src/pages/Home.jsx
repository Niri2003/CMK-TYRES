import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import frontImage from '../assets/front.png';

const HERO_CONTENT = {
  title: "Reliable Tyres & Wheel Alignment Services",
  description: "Building trust through quality service and long-term partnerships.",
  cta: "Explore Services",
};

const Home = () => {
  return (
    <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 md:px-0">
      <div className="flex flex-col items-start text-left">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          {HERO_CONTENT.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          {HERO_CONTENT.description}
        </p>
        
        {/* Wrap the button in a Link component pointing to /collection */}
        <Link to="/collection">
          <button 
            className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-all duration-200"
          >
            {HERO_CONTENT.cta}
          </button>
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-xl shadow-2xl">
        <img
          src={frontImage}
          alt="Professional wheel alignment and tyre service"
          className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
          loading="eager"
          fetchpriority="high"
        />
      </div>
    </section>
  );
};

export default Home;