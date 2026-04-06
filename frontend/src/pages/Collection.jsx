import React from 'react';
import { useNavigate } from "react-router-dom";

const SERVICES = [
  {
    id: 1,
    title: "Wheel Alignment",
    description: "Proper wheel alignment improves your vehicle's handling, ensures even tyre wear, and enhances fuel efficiency. We use advanced computerized alignment systems to precisely adjust your vehicle's suspension angles to factory specifications.",
  },
  {
    id: 2,
    title: "Wheel Balancing",
    description: "Wheel balancing is essential for a smooth and vibration-free ride. Our expert technicians use high-precision balancing machines to evenly distribute weight around the tyre and wheel assembly, improving comfort and extending tyre life.",
  },
  {
    id: 3,
    title: "Road Force Wheel Balancing",
    description: "Unlike regular balancing, Road Force Balancing simulates road conditions to detect tyre and wheel imbalances that traditional machines may miss. This premium service ensures maximum driving comfort and optimal tyre performance, especially for high-performance vehicles.",
  },
  {
    id: 4,
    title: "2 Wheeler Balancing",
    description: "We also provide professional two-wheeler (bike) tyre balancing to improve ride stability, safety, and tyre longevity. Perfect for both daily commuters and performance bikers.",
  },
  {
    id: 5,
    title: "Wheel Rotation",
    description: "Regular rotation of your tyres helps promote even wear across all tyres, improving grip and increasing overall tyre lifespan. Our team ensures your tyres are rotated following best practices and vehicle-specific patterns.",
  },
  {
    id: 6,
    title: "Road Assistance Support",
    description: "Stuck with a flat tyre or sudden breakdown? Our quick and responsive roadside assistance team is just a call away—ready to help with emergency tyre support and minor repairs within city limits.",
  },
  {
    id: 7,
    title: "Tyre Delivery",
    description: "Can't make it to our store? We offer doorstep delivery of premium tyres. Select your brand, and we will deliver it to your location in Kottayam or Manarcad, ensuring you get back on the road with zero hassle.",
  }
];

const Collection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      
      {/* Sidebar */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center gap-2 uppercase font-medium">
          Our Expertise
        </p>
        <div className="border border-gray-300 pl-5 py-3 mt-6 hidden sm:block">
          <p className="mb-3 text-sm font-medium">SERVICE TYPES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p>Mechanical Services</p>
            <p>Maintenance</p>
            <p>Emergency Support</p>
            <p>Logistics (Delivery)</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <h1 className="text-gray-500">
            ALL <span className="text-gray-700 font-medium">SERVICES</span>
          </h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-10">
          {SERVICES.map((item) => (
            <div key={item.id} className="border p-6 rounded-lg hover:shadow-lg transition-all duration-300 bg-white group">
              
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>

              {/* 🔥 CLICK HANDLER ADDED HERE */}
              <div
                onClick={() => navigate('/book', { state: { service: item } })}
                className="mt-4 flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Book This Service →
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Collection;