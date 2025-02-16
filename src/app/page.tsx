"use client";

import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import CardDisplay from "./components/card-display";
import Filter from "./components/filter";
import Navigation from "./components/navigation";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dummy DIY Images
  const images = [
    {
      src: "/grid/img1.png",
      title: "Creative DIY",
      creator: "John Doe",
      category: "Beginner-Friendly",
      href: "/detail",
    },
    {
      src: "/grid/img2.png",
      title: "Eco-Friendly Craft",
      creator: "Jane Smith",
      category: "Trending",
      href: "/detail",
    },
    {
      src: "/grid/img3.png",
      title: "Aesthetic Art",
      creator: "Emily Brown",
      category: "Advanced",
      href: "/detail",
    },
    {
      src: "/grid/img4.png",
      title: "Handmade Decor",
      creator: "Mark Wilson",
      category: "Home Decor",
      href: "/detail",
    },
    {
      src: "/grid/img5.png",
      title: "Upcycling Idea",
      creator: "Alice Johnson",
      category: "Kids Crafts",
      href: "/detail",
    },
    {
      src: "/grid/img6.png",
      title: "Nature Inspired",
      creator: "David Lee",
      category: "Seasonal",
      href: "/detail",
    },
    {
      src: "/grid/img7.png",
      title: "DIY Masterpiece",
      creator: "Sophia Miller",
      category: "Trending",
      href: "/detail",
    },
    {
      src: "/grid/img8.png",
      title: "Artistic Touch",
      creator: "Michael Davis",
      category: "Beginner-Friendly",
      href: "/detail",
    },
  ];

  // Filtered images based on selected category
  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <>
      <Navigation />

      <div className='pt-16 max-w-7xl mx-auto px-4'>
        {/* Filter Section with Icon */}
        <div className='flex items-center gap-2'>
          <IoFilterOutline className='text-gray-600 cursor-pointer text-xl' />
          <Filter onSelect={setSelectedCategory} />
        </div>

        {/* Masonry Grid Layout */}
        <div className='columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4'>
          {filteredImages.map(({ src, title, creator }, index) => (
            <CardDisplay
              key={index}
              src={src}
              title={title}
              creator={creator}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
