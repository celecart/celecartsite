"use client";
import React, { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-black/70 via-[#181E2A] text-white px-6 py-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-orange-400 text-2xl font-bold">CELECART</span>
            <span className="text-orange-300 text-sm font-normal ml-2">CELEBRITY STYLE</span>
          </Link>
        </div>

        {/* Navigation Menu (Desktop) */}
        <nav className="hidden xl:flex items-center space-x-8 rounded-full border border-gray-100/50 px-6 py-3">
          <Link href="/featured" className="text-white hover:text-orange-400 transition-colors font-medium text-sm">FEATURED</Link>
          <Link href="/celebrities" className="text-white hover:text-orange-400 transition-colors font-medium text-sm">CELEBRITIES</Link>
          <Link href="/trending" className="text-white hover:text-orange-400 transition-colors font-medium text-sm">TRENDING</Link>
          <Link href="/brands" className="text-white hover:text-orange-400 transition-colors font-medium text-sm">BRANDS</Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Filter Button */}
          <button className="hidden xl:flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <span className="text-sm font-medium">ALL CELEBRITIES</span>
          </button>

          {/* Search Bar */}
          <div className="relative hidden xl:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search celebrities..."
              className="border border-gray-100/50 bg-gradient-to-r from-[#554A30] via-[#513F2A] to-[#4B3829] text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-gray-700 transition-colors"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              // Close Icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger Icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="xl:hidden mt-4 pt-4 border-t border-gray-700">
          <nav className="flex flex-col space-y-3">
            <Link href="/featured" className="text-white hover:text-orange-400 transition-colors font-medium py-2">FEATURED</Link>
            <Link href="/celebrities" className="text-white hover:text-orange-400 transition-colors font-medium py-2">CELEBRITIES</Link>
            <Link href="/trending" className="text-white hover:text-orange-400 transition-colors font-medium py-2">TRENDING</Link>
            <Link href="/brands" className="text-white hover:text-orange-400 transition-colors font-medium py-2">BRANDS</Link>
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors w-fit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              <span className="text-sm font-medium">ALL CELEBRITIES</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
