import React from 'react'

export default function PromoBanner() {
  return (
    <section className="container m-auto mt-10 px-4">
      <div className="grid justify-center items-stretch gap-6 row-gap-6 lg:grid-cols-2">
        <div
          className="relative rounded-2xl p-8 text-white min-h-[180px] bg-gradient-to-br from-[#00BC7D] to-[#007A55] order-1"
          style={{ background: 'linear-gradient(170deg, #00BC7D 0%, #007A55 100%)' }}
        >
          <h3 className="text-2xl font-bold mb-2">Fresh Deals</h3>
          <p className="opacity-90">Up to 50% off on groceries every week.</p>
        </div>
        <div
          className="relative rounded-2xl p-8 text-white min-h-[180px] bg-gradient-to-br from-[#FF8904] to-[#FF2056]"
          style={{ background: 'linear-gradient(170deg, #FF8904 0%, #FF2056 100%)' }}
        >
          <h3 className="text-2xl font-bold mb-2">Fast Delivery</h3>
          <p className="opacity-90">Same-day delivery on all orders over EGP 200.</p>
        </div>
      </div>
    </section>
  )
}
