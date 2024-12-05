import React from 'react';

const Categoria_recetas = () => {
    
  return (
    <section className="container mx-auto px-4 py-12">
    <div className="grid gap-6 md:grid-cols-3">
      {/* Personal Care Card */}
      <div className="overflow-hidden bg-[#EEF3FF] rounded-lg shadow-md">
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">10% cashback on personal care</h2>
              <div className="mt-2 space-y-1 text-gray-600">
                <p>Max cashback: $12</p>
                <p>Code: <span className="font-semibold">CARE12</span></p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#0A2540] text-white rounded hover:bg-[#0A2540]/90">
              Shop Now
            </button>
            <div className="relative h-40 mt-4">
              <img
                src="/placeholder.svg?height=160&width=200"
                alt="Personal care products"
                className="object-contain object-right absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
  
      {/* Fresh Produce Card */}
      <div className="overflow-hidden bg-[#FFF8E7] rounded-lg shadow-md">
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Say yes to season's fresh</h2>
              <p className="mt-2 text-gray-600">Refresh your day the fruity way</p>
            </div>
            <button className="px-4 py-2 bg-[#0A2540] text-white rounded hover:bg-[#0A2540]/90">
              Shop Now
            </button>
            <div className="relative h-40 mt-4">
              <img
                src="/placeholder.svg?height=160&width=200"
                alt="Fresh fruits and vegetables"
                className="object-contain object-right absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
  
      {/* Ice Cream Card */}
      <div className="overflow-hidden bg-[#E8F7F7] rounded-lg shadow-md">
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">When in doubt, eat ice cream</h2>
              <p className="mt-2 text-gray-600">Enjoy a scoop of summer today</p>
            </div>
            <button className="px-4 py-2 bg-[#0A2540] text-white rounded hover:bg-[#0A2540]/90">
              Shop Now
            </button>
            <div className="relative h-40 mt-4">
              <img
                src="/placeholder.svg?height=160&width=200"
                alt="Ice cream dessert"
                className="object-contain object-right absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};



export default Categoria_recetas;

