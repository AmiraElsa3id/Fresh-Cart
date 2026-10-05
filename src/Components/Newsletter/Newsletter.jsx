import React from 'react'

export default function Newsletter() {
  return (
    <section className="mt-16 bg-[#DCFCE7] border-y border-green-200">
      <div className="container m-auto py-8 px-4 flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-ink">Join our newsletter</h2>
        <p className="text-slate-500">Get fresh deals and weekly offers straight to your inbox.</p>
        <form className="w-full max-w-md flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary"
            required
          />
          <button className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-dark">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
