"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaBookmark,
  FaChartBar,
  FaHome,
  FaPlus,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import "../globals.css";
import ProfileImage from "./profile-image";

// Props interface
interface NavigationProps {
  initialProfileImageUrl?: string | null;
  initialUsername?: string;
}

const Navigation = ({
  initialProfileImageUrl = null,
  initialUsername = "",
}: NavigationProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // State to store the profile image URL
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    initialProfileImageUrl
  );
  const [username, setUsername] = useState(initialUsername);

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdate = (e: CustomEvent) => {
      console.log("Profile update detected");
      const updatedProfile = e.detail;
      if (updatedProfile?.profileImageUrl) {
        setProfileImageUrl(updatedProfile.profileImageUrl);
      }
      if (updatedProfile?.username) {
        setUsername(updatedProfile.username);
      }
    };

    // Add event listener
    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate as EventListener
      );
    };
  }, []);

  // Reset search by removing the search param from the URL
  const resetSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("search");
    router.push(`/?${newParams.toString()}`);
  };

  // Search is only triggered when user clicks the button or presses Enter
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("search", searchQuery);
    router.push(`/?${newParams.toString()}`);
  };

  // Handle input change and reset if empty
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      resetSearch();
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Data", href: "/data" },
    { name: "Upload", href: "/upload" },
    { name: "Bookmark", href: "/bookmark" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className='hidden md:flex justify-between items-center px-12 py-3 shadow-lg bg-white w-full fixed top-0 z-50 border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          <Image src='/logo.svg' alt='Logo' width={40} height={40} />
          <h1 className='text-xl font-bold text-gray-900 mr-10'>Srok Sart</h1>
        </div>

        {/* Navigation Links */}
        <div className='flex items-center gap-5 text-gray-800 font-medium'>
          {navItems.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative py-2 px-4 rounded-full transition-all ${
                pathname === href
                  ? "bg-[var(--primary-color)] text-white font-bold"
                  : "hover:text-[var(--primary-color)]"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Desktop Search Input */}
        <div className='relative flex-1 mx-4 max-w-[700px] lg:max-w-[850px]'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search'
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (searchQuery.trim() === "") {
                    resetSearch();
                  } else {
                    handleSearch();
                  }
                }
              }}
              className='bg-gray-200 rounded-full pl-10 pr-12 py-2 w-full focus:outline-none'
            />
            <FaSearch
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
              onClick={() => {
                if (searchQuery.trim() === "") {
                  resetSearch();
                } else {
                  handleSearch();
                }
              }}
            />
          </div>
        </div>

        {/* Profile Icon */}
        <div className='flex items-center gap-4'>
          <Link
            href='/profile'
            className='rounded-full overflow-hidden w-10 h-10'
          >
            <ProfileImage
              src={profileImageUrl}
              alt={username || "User Profile"}
              size={40}
              className='w-10 h-10 rounded-full'
            />
          </Link>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className='md:hidden fixed top-0 w-full bg-white px-3 pt-2 z-50 border-b border-gray-200'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (searchQuery.trim() === "") {
                  resetSearch();
                } else {
                  handleSearch();
                }
              }
            }}
            className='bg-white border border-gray-300 rounded-full pl-8 pr-10 py-2 w-full shadow-lg focus:outline-none text-sm'
          />
          <FaSearch
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
            onClick={() => {
              if (searchQuery.trim() === "") {
                resetSearch();
              } else {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className='md:hidden fixed bottom-0 w-full bg-white shadow-xl py-3 flex justify-around items-center border-t border-gray-300 z-[100]'>
        <Link
          href='/'
          className={`flex flex-col items-center ${
            pathname === "/"
              ? "text-[var(--primary-color)]"
              : "text-gray-500 hover:text-black"
          }`}
        >
          <FaHome size={22} />
        </Link>
        <Link
          href='/data'
          className={`flex flex-col items-center ${
            pathname === "/data"
              ? "text-[var(--primary-color)]"
              : "text-gray-500 hover:text-black"
          }`}
        >
          <FaChartBar size={22} />
        </Link>
        <Link
          href='/upload'
          className={`flex flex-col items-center ${
            pathname === "/upload"
              ? "text-[var(--primary-color)]"
              : "text-gray-500 hover:text-black"
          }`}
        >
          <FaPlus size={22} />
        </Link>
        <Link
          href='/bookmark'
          className={`flex flex-col items-center ${
            pathname === "/bookmark"
              ? "text-[var(--primary-color)]"
              : "text-gray-500 hover:text-black"
          }`}
        >
          <FaBookmark size={22} />
        </Link>
        <Link
          href='/profile'
          className={`flex flex-col items-center ${
            pathname === "/profile"
              ? "text-[var(--primary-color)]"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {profileImageUrl ? (
            <div className='w-6 h-6 rounded-full overflow-hidden'>
              <ProfileImage
                src={profileImageUrl}
                alt={username || "User Profile"}
                size={24}
                className='w-6 h-6 rounded-full'
              />
            </div>
          ) : (
            <FaUser size={22} />
          )}
        </Link>
      </nav>

      {/* Spacer to prevent content from being covered (Desktop) */}
      <div className='hidden md:block w-full h-[35px]' />
    </>
  );
};

export default Navigation;
