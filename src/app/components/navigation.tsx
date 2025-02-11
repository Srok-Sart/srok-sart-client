"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHome, FaPlus, FaUser, FaChartBar, FaBookmark } from "react-icons/fa";
import "../globals.css";

const Navigation = () => {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-between items-center px-6 py-3 shadow-lg bg-white w-full fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-gray-900">Srok Sart</h1> {/* Replace with your brand name */}
        </div>
        <div className="flex items-center gap-6 text-gray-800 font-medium">
          <Link href="/home" className="hover:text-[var(--primary-color)]">Home</Link>
          <Link href="/earth" className="hover:text-[var(--primary-color)]">Earth</Link>
          <Link href="/upload" className="hover:text-[var(--primary-color)]">Upload</Link>
          <Link href="/saved" className="hover:text-[var(--primary-color)]">Saved</Link>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full px-4 py-2 w-64 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-gray-300 rounded-full px-3 py-2 text-gray-700 font-bold">R</span>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white shadow-xl py-3 flex justify-around items-center border-t border-gray-300">
        <Link href="/home" className="text-gray-500 hover:text-black flex flex-col items-center">
          <FaHome size={22} />
        </Link>
        <Link href="/stats" className="text-gray-500 hover:text-black flex flex-col items-center">
          <FaChartBar size={22} />
        </Link>
        <Link href="/UploadForm" className="text-gray-500 hover:text-black flex flex-col items-center">
          <FaPlus size={28} className="bg-[var(--primary-color)] text-white p-2 rounded-full" />
        </Link>
        <Link href="/saved" className="text-gray-500 hover:text-black flex flex-col items-center">
          <FaBookmark size={22} />
        </Link>
        <Link href="/profile" className="text-gray-500 hover:text-black flex flex-col items-center">
          <FaUser size={22} />
        </Link>
      </nav>
    </>
  );
};

export default Navigation;
