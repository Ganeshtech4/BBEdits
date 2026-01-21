'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function AIFeatureSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    const sectionElement = sectionRef.current;

    if (!videoElement || !sectionElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            videoElement.play().catch((error) => {
              console.log('Video play failed:', error);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Split text into words for animation
  const title = "Transform your creative vision into reality.";
  const words = title.split(' ');

  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-b from-[#030014] to-black pt-8 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-12 sm:pb-16 md:pb-20 lg:pb-0 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px]">
          
          {/* Left Content */}
          <div className="w-full lg:flex-[1.5] xl:flex-[1.6] space-y-4 sm:space-y-5 md:space-y-6 text-center sm:text-left flex flex-col justify-center py-6 sm:py-8 lg:py-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white leading-tight">
              {words.map((word, index) => {
                const isGradient = word === 'creative' || word === 'vision';
                return (
                  <span
                    key={index}
                    className="inline-block mr-[0.25em]"
                    style={{
                      animationName: isVisible ? 'slideUp' : 'none',
                      animationDuration: '0.6s',
                      animationTimingFunction: 'ease-out',
                      animationFillMode: 'forwards',
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0,
                      transform: 'translateY(20px)',
                    }}
                  >
                    <span className={isGradient ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600' : ''}>
                      {word}
                    </span>
                  </span>
                );
              })}
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl text-gray-300 max-w-full lg:max-w-2xl leading-relaxed">
              Master professional video editing skills with our comprehensive courses. 
              Learn industry-standard techniques, creative storytelling, and advanced workflows 
              that bring your ideas to life.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link href="/courses">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-base sm:text-lg transition-all duration-300 shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]">
                  Get started
                </button>
              </Link>
              
              <a href="https://www.instagram.com/bb_edits00/" target="_blank" rel="noopener noreferrer">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl border border-white/20 hover:border-white/40 bg-transparent text-white font-semibold text-base sm:text-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Follow us
                </button>
              </a>
            </div>
          </div>
          
          {/* Right Video */}
          <div className="w-full lg:flex-[0.8] xl:flex-[0.75] relative flex items-center lg:items-end justify-center lg:justify-end self-stretch">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[320px] xl:max-w-[360px] 2xl:max-w-[400px] h-[350px] sm:h-[400px] md:h-[420px] lg:h-[400px] xl:h-[420px] 2xl:h-[450px] overflow-hidden">
              {/* Video */}
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full h-auto object-cover object-top"
              >
                <source src="/home/Mobile.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
