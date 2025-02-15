"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaPlus, FaUser, FaChartBar, FaBookmark, FaSearch } from "react-icons/fa";
import "../globals.css";

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/home" }, 
    { name: "Earth", href: "/earth" },
    { name: "Upload", href: "/upload" },
     { name: "Saved", href: "/saved" }
  ];

  const mobileNavItems = [
    { icon: <FaHome size={22} />, href: "/home" },
    { icon: <FaChartBar size={22} />, href: "/stats" },
    { icon: <FaPlus size={28} className="bg-[var(--primary-color)] text-white p-2 rounded-full" />, href: "/upload" },
    { icon: <FaBookmark size={22} />, href: "/saved" },
    { icon: <FaUser size={22} />, href: "/profile" },
  ];

  return (
    <>
    {/* Just blank space*/}
      <div className="hidden md:block pt-12"></div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-between items-center px-12 py-3 shadow-lg bg-white w-full fixed top-0 z-50 border-b border-gray-200">
        <div className="flex items-center gap-3 mr-20">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-gray-900">Srok Sart</h1>
        </div>
        <div className="flex items-center gap-5 text-gray-800 font-medium ml-2">
          {navItems.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative py-2 px-4 rounded-full ${pathname === href ? "bg-[var(--primary-color)] text-white font-bold" : "hover:text-[var(--primary-color)]"}`}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="relative flex-1 mx-0 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-200 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-bold">
            R
          </button>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      {/* <nav className="md:hidden fixed bottom-0 w-full bg-white shadow-xl py-3 flex justify-around items-center border-t border-gray-300">
        {mobileNavItems.map(({ icon, href }, index) => (
          <Link
            key={index}
            href={href}
            className={`flex flex-col items-center ${pathname === href ? "text-[var(--primary-color)]" : "text-gray-500 hover:text-black"}`}
          >
            {icon}
          </Link>
        ))}
      </nav> */}
      {/* Bottom Navigation (Mobile) */}
    <nav className="md:hidden fixed bottom-0 w-full bg-white shadow-xl py-3 flex justify-around items-center border-t border-gray-300 z-[100]">
      {mobileNavItems.map(({ icon, href }, index) => (
        <Link
          key={index}
          href={href}
          className={`flex flex-col items-center ${pathname === href ? "text-[var(--primary-color)]" : "text-gray-500 hover:text-black"}`}
        >
          {icon}
        </Link>
      ))}
    </nav>

    </>
  );
};

export default Navigation;
