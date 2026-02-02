'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Heading from '../utils/Heading';

const categories = [
  'All',
  'Events & Weddings',
  'Car Delivery',
  'Celebrities',
  'Outfit Shoots',
  'Concerts',
  'Collaborations',
  'Caterers',
];

const works = [
  {
    image: '/home/work/work1.webp',
    category: 'Events & Weddings',
  },
  {
    image: '/home/work/2v.webp',
    category: 'Collaborations',
  },
  {
    image: '/home/work/3v.webp',
    category: 'Events & Weddings',
  },
  {
    image: '/home/work/4v.webp',
    category: 'Outfit Shoots',
  },
  {
    image: '/home/work/5v.webp',
    category: 'Concerts',
  },
  {
    image: '/home/work/work1.webp',
    category: 'Car Delivery',
  },
  {
    image: '/home/work/2v.webp',
    category: 'Celebrities',
  },
  {
    image: '/home/work/3v.webp',
    category: 'Caterers',
  },
];

const OurWorksPage = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState('Login');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredWorks = selectedCategory === 'All' 
    ? works 
    : works.filter(work => work.category === selectedCategory);

  return (
    <>
      <Heading
        title="Our Works - BBEdits"
        description="Explore our portfolio of creative video editing projects"
        keywords="video editing portfolio, our works, BBEdits projects"
      />
      <div className="min-h-screen bg-[#030014]">
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />

        {/* Hero Section */}
        <div className="w-full pt-28 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                Discover with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
                  Vibe
                </span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Explore trending reels from our creators
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Works Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredWorks.map((work, index) => (
                <div
                  key={index}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
                >
                  <Image
                    src={work.image}
                    alt={`Work ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-medium">
                        {work.category}
                      </span>
                    </div>
                  </div>
                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40">
                      <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]">
                Load More Works
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default OurWorksPage;
