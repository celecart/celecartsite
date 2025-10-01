import React from "react";

export default function CTASection() {
  return (
    <div className="bg-[#1D2330] w-full px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-around gap-8">
          <div className="flex flex-col gap-3 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold font-playfair">
              Get Style Updates
            </h1>
            <p className="max-w-md text-white/70 mx-auto lg:mx-0">
              Subscribe to our newsletter for the latest celebrity fashion
              insights and brand spotlights. Be the first to know about new
              style trends.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="text-sm px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9A21F] focus:border-none w-full sm:w-80 bg-black"
              />
              <button className="bg-[#F9A21F] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#e0911a] transition text-sm w-full sm:w-auto">
                Subscribe
              </button>
            </div>
            <p className="max-w-md text-white/70 text-xs text-center sm:text-left">
              By subscribing you agree to our Privacy Policy and receive fashion
              updates from Style Spotlight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
