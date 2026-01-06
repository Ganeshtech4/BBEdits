'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Suspense } from 'react'
import LightRays from '../LightRays'
import { Instagram, Youtube, Send, Mail } from 'lucide-react'
import Image from 'next/image'

export default function HomeHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect()
          const x = (e.clientX - rect.left - rect.width / 2) / rect.width
          const y = (e.clientY - rect.top - rect.height / 2) / rect.height
          setMousePosition({ x: x * 10, y: y * 10 })
        }
      })
    }

    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          // Section is out of view, reset
          setMousePosition({ x: 0, y: 0 })
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-full min-h-[90vh] bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black overflow-hidden" ref={heroRef}>
      {/* Light rays in the background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100">
        <Suspense fallback={null}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#fff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="w-full h-full"
          />
        </Suspense>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-12">
               
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-3 sm:mb-6">
          <h3 className="text-xs sm:text-base md:text-lg text-gray-600 dark:text-gray-400 font-semibold mb-1 sm:mb-2 tracking-wide">
            Hi, I&apos;m Anil Bangaru
          </h3>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-black dark:text-white mb-3 sm:mb-6 leading-tight px-2">
            Video Editing Mastery<br />
            Learn from Scratch
          </h1>
        </div>

        {/* Main Card with 3D Effect */}
        <div className="relative mb-3 sm:mb-6">
          <div
            ref={cardRef}
            className="relative w-52 sm:w-56 md:w-64 lg:w-72 h-64 sm:h-64 md:h-72 lg:h-80
                      bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800/50 dark:to-gray-900/50 
                      rounded-2xl backdrop-blur-sm border border-gray-300 dark:border-white/10 shadow-2xl 
                      transition-all duration-300 ease-out overflow-visible"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
            }}
          >
            {/* Image Layer */}
            <div className="absolute inset-0 flex justify-center overflow-visible z-30">
              <div className="absolute inset-0 -top-8 w-full h-[110%] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/anil.webp"
                  alt="Profile"
                  fill
                  sizes="(max-width: 640px) 210px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
            </div>

            {/* Floating Icons Layer */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Top Left - Photoshop */}
              <div className="absolute top-0 sm:top-2 -left-8 sm:-left-12 md:-left-10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-xl transition-transform duration-300 ease-out
                            pointer-events-auto hover:scale-110 hover:-rotate-6">
                  <Image
                    src="/images/Adobe_After_Effects_CC_icon.png"
                    alt="Photoshop"
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Top Right - DaVinci Resolve */}
              <div className="absolute top-0 sm:top-2 -right-6 sm:-right-10 md:-right-8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-xl transition-transform duration-300 ease-out
                            pointer-events-auto hover:scale-110 hover:rotate-6">
                  <Image
                    src="/images/DaVinci_Resolve_logo.png"
                    alt="DaVinci Resolve"
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Bottom Left - After Effects */}
              <div className="absolute top-12 sm:top-16 md:top-20 -left-6 sm:-left-10 md:-left-10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-xl transition-transform duration-300 ease-out
                            pointer-events-auto hover:scale-110 hover:-rotate-6">
                  <Image
                    src="/images/Adobe_Premiere_Pro_CC.png"
                    alt="After Effects"
                    width={50}
                    height={50}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
            
        {/* Social & Contact */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-4 px-4">
          <div className="flex gap-3 sm:gap-3">
            <a href="https://www.instagram.com/bb_edits00?igsh=MXNzajZwbTRtd255aw==" target="_blank" rel="noopener noreferrer" 
               className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gray-200 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center 
                         text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <Instagram className="w-5 h-5 sm:w-5 sm:h-5" />
            </a>
            <a href="https://youtube.com/@bbedits4567?si=6xAhz86mzCfc7v7z" target="_blank" rel="noopener noreferrer" 
               className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gray-200 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center 
                         text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <Youtube className="w-5 h-5 sm:w-5 sm:h-5" />
            </a>
            <a href="https://t.me/bbeditsanil" target="_blank" rel="noopener noreferrer" 
               className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gray-200 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center 
                         text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <Send className="w-5 h-5 sm:w-5 sm:h-5" />
            </a>
          </div>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-semibold 
                           flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg 
                           text-sm sm:text-sm md:text-base whitespace-nowrap">
            <Mail className="w-4 h-4 sm:w-4 sm:h-4" />
            <span>Enroll Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}