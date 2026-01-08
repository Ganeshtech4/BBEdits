'use client'

import React, { useState, useEffect, useRef } from 'react'
import Threads from '../Threads'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const THREADS_COLOR: [number, number, number] = [0.32, 0.15, 1];

export default function HomeHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  
  // YouTube Video ID - Replace with your actual video ID (leave empty to show only thumbnail)
  const youtubeVideoId = "" // Example: "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ

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
    <div className="relative w-full min-h-screen bg-[#030014] overflow-hidden flex flex-col items-center justify-center pt-48 pb-32" ref={heroRef}>
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#030014] to-transparent z-10 pointer-events-none" />


      {/* Threads Wave Effect - Full Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Threads
          color={THREADS_COLOR}
          amplitude={2}
          distance={0.3}
          enableMouseInteraction={true}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center gap-6">

        {/* Text Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Video Editing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
              Mastery
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Master the art of video editing with our comprehensive courses.
            <br />
            From beginner basics to advanced techniques, learn professional
            <br className="hidden md:block" />
            editing skills that transform your creative vision into stunning reality.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 z-20 mt-8">
          {/* Join Waitlist Button */}
          <button className="relative px-8 py-3 rounded-2xl bg-[#5b21b6] border border-[#7c3aed] text-white font-semibold text-lg hover:bg-[#4c1d95] transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.8)] flex items-center gap-3 group">
            <span>Join Waitlist</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Join Community Button */}
          <button className="px-8 py-3 rounded-2xl border border-white/10 hover:border-white/20 bg-transparent text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
            Join Community
          </button>
        </div>

        {/* Main Video Card with 3D Effect - Centered Below */}
        <div className="relative mt-16 group cursor-pointer perspective-1000">
          <div
            ref={cardRef}
            className="relative w-[450px] sm:w-[1000px] h-[280px] sm:h-[560px]
                      bg-gradient-to-br from-gray-900/80 to-black/80
                      rounded-2xl backdrop-blur-sm border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.15)]
                      transition-all duration-300 ease-out overflow-hidden"
            style={{
              transform: `rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
            }}
            onClick={() => youtubeVideoId && setIsPlaying(true)}
          >
            {!isPlaying || !youtubeVideoId ? (
              <>
                {/* Thumbnail Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/home/Homebb.jpg"
                    alt="Video Thumbnail"
                    fill
                    sizes="(max-width: 768px) 100vw, 1000px"
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>
                
                {/* Play Button Overlay - Only show if video ID exists */}
                {youtubeVideoId && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-600/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(147,51,234,0.6)]">
                      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : youtubeVideoId ? (
              /* YouTube Video Player */
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : null}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-600/20 blur-[60px] -z-10 rounded-full pointer-events-none" />
        </div>

      </div>
    </div>
  )
}