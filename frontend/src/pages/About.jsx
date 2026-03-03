import React from 'react'
import aboutImg from '../assets/about.jpg'
const About = () => {
  return (
    <div className="py-12">
      <div className="text-2xl text-center pt-8 border-t">
        <h2 className="text-gray-500">ABOUT <span className="text-gray-700 font-medium">US</span></h2>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16 items-center">
        <img 
            src={aboutImg} 
            alt="Workshop" 
            className="w-full md:max-w-[450px] rounded-lg shadow-md"
 />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            With a legacy spanning over 40+ years, C.M. Kurian & Company has grown to become Kerala’s leading multi-brand tyre dealer and the most trusted name in Kottayam for premium tyres and expert automotive services.
What sets us distinctly apart is our exclusive recognition by global tyre manufacturers — we are the only tyre dealer in Kottayam to be honored as a Michelin Priority Partner, Apollo Zone Dealer, Bridgestone Mega B Dealer, and a certified Yokohama Club Network (YCN) Member. These prestigious partnerships are awarded to select dealers who consistently meet the highest standards of service, expertise, and performance in the industry.
We are also proud to be the only authorised Vredestein tyre dealer in Kottayam, offering premium solutions for both two-wheelers and four-wheelers. This unique position allows us to deliver cutting-edge tyre technology and international quality to the local market — all under one trusted roof.
Operating from our two fully equipped outlets in S.H. Mount, Kottayam and Manarcadu, Kottayam, we cater to the complete mobility spectrum — serving customers who own two-wheelers, passenger cars, SUVs, light commercial vehicles, trucks, buses, and heavy-duty lorries.
Every tyre purchase from C.M. Kurian & Company includes instant digital warranty registration, done on the spot at our store. As authorised elite partners, we are uniquely equipped to provide this facility — ensuring authenticity, transparency, and brand-backed assurance with every transaction.
At C.M. Kurian & Company, we don’t just sell tyres — we deliver trust, safety, and performance for every journey you take. Backed by world-class partnerships and decades of expertise, we remain your reliable tyre partner — driven by quality and committed to excellence.
          </p>
          
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-xl py-4">
        <h2 className="text-gray-500">WHY <span className="text-gray-700 font-medium">CHOOSE US</span></h2>
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-default">
          <b>Quality Assurance:</b>
          <p>Every tyre in our collection undergoes rigorous quality checks to ensure it meets safety standards.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-default">
          <b>Expert Service:</b>
          <p>Our technicians are highly trained in the latest wheel alignment and fitting technologies.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-default">
          <b>Customer Support:</b>
          <p>Our team is always ready to assist you in choosing the perfect tyre for your specific driving needs.</p>
        </div>
      </div>
    </div>
  )
}

export default About