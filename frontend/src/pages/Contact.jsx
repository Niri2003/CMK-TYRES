import React from 'react'

const Contact = () => {
  return (
    <div className="py-12 px-4">
      <div className="text-center text-2xl pt-10 border-t">
        <h2 className="text-gray-500">CONTACT <span className="text-gray-700 font-medium">US</span></h2>
      </div>

      <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-28">
        {/* Branch 1: Kottayam */}
        <div className="flex flex-col gap-4 p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="font-bold text-xl text-orange-600">KOTTAYAM (Main Branch)</h3>
          <p className="text-gray-600 font-medium">7306200929 | 0481 2568765</p>
          <p className="text-gray-500">
            Chalakuzhy Bhavan S.H Mount, <br />
            M.C Road, Kottayam, Kerala 686006
          </p>
        </div>

        {/* Branch 2: Manarcad */}
        <div className="flex flex-col gap-4 p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="font-bold text-xl text-orange-600">MANARCARD</h3>
          <p className="text-gray-600 font-medium">8289924763 | 8281371785</p>
          <p className="text-gray-500">
            Chalakuzhy Building Illivalavu JN, <br />
            K.K Road, Manarcadu, Kottayam 686019
          </p>
        </div>
      </div>
      
    </div>
  )
}

export default Contact