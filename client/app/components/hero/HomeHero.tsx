'use client'

import React, { useState, useEffect, useRef } from 'react'
import Threads from '../Threads'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

const THREADS_COLOR: [number, number, number] = [0.32, 0.15, 1];

export default function HomeHero() {
  const router = useRouter()
  const { user } = useSelector((state: any) => state.auth)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  
  // YouTube Video ID
  const youtubeVideoId = "v33Zf9jXq08"

  // Check if user has enrolled in any course
  const hasEnrolledCourses = user && typeof user === 'object' && user.courses && user.courses.length > 0

  const handleCommunityClick = () => {
    if (hasEnrolledCourses) {
      window.open('https://t.me/bbeditsanil', '_blank')
    } else {
      alert('Please enroll in a course to join our community!')
    }
  }

  useEffect(() => {
    let animationFrameId: number
    let lastTime = 0
    const throttleDelay = 16 // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleDelay) return
      lastTime = now
      
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

  useEffect(() => {
    // Trigger intro animations on mount
    setIsMounted(true)
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current)
      }
    }
  }, [])

  const titleText = "Video Editing"
  const words = titleText.split(' ')

  return (
    <div className="relative w-full min-h-screen bg-[#030014] overflow-hidden flex flex-col items-center justify-center pt-12 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 pb-6 sm:pb-10 md:pb-16 lg:pb-19 xl:pb-16 px-4 sm:px-6 md:px-8" ref={heroRef}>
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] bg-purple-900/40 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[150px] sm:h-[200px] md:h-[300px] bg-gradient-to-t from-[#030014] to-transparent z-10 pointer-events-none" />

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
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-4 sm:gap-6">

        {/* Text Content */}
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight">
            <style jsx>{`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: scale(0.95) translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}</style>
            {words.map((word, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  opacity: isVisible ? 1 : 0,
                  animation: isVisible ? `slideUp 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                  marginRight: '0.25em'
                }}
              >
                {word}
              </span>
            ))}{" "}
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600"
              style={{
                display: 'inline-block',
                opacity: isVisible ? 1 : 0,
                animation: isVisible ? `slideUp 0.6s ease-out ${words.length * 0.1}s forwards` : 'none',
              }}
            >
              Mastery
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
            Master the art of video editing with our comprehensive courses.
            <br className="hidden sm:block" />
            From beginner basics to advanced techniques, learn professional{" "}
            <br className="hidden lg:block" />
            editing skills that transform your creative vision into stunning reality.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 z-20 mt-4 sm:mt-6 md:mt-8 w-full px-4 sm:px-0 max-w-5xl mx-auto">
          {/* Start Course Button with Line */}
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto sm:flex-1 justify-end">
            {/* Decorative Line - Hidden on mobile */}
            <div className="hidden sm:block flex-1 max-w-[200px] lg:max-w-[280px] h-px bg-gradient-to-r from-transparent via-white/50 to-white" />
            
            <button 
              onClick={() => router.push('/courses')}
              className="w-full sm:w-auto relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#5b21b6] border border-[#7c3aed] text-white font-semibold text-base sm:text-lg hover:bg-[#4c1d95] transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.8)] flex items-center justify-center gap-3 group whitespace-nowrap"
            >
              <span>Start Course</span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </button>
          </div>

          {/* Join Community Button with Dot */}
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto sm:flex-1">
            <button 
              onClick={handleCommunityClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 bg-transparent text-white font-semibold text-base sm:text-lg hover:bg-white/5 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center whitespace-nowrap"
            >
              Join Community
            </button>
            
            {/* Decorative Dot - Hidden on mobile */}
            <div className="hidden sm:block w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
        </div>

        {/* Main Video Card with 3D Effect - Centered Below */}
        <div 
          className="relative mt-8 sm:mt-12 md:mt-16 group cursor-pointer perspective-1000 w-full max-w-[90vw] sm:max-w-[85vw] md:max-w-[1000px]"
          style={{
            opacity: isMounted ? 1 : 0,
            animation: isMounted ? 'fadeInScale 0.8s ease-out 0.4s forwards' : 'none',
          }}
        >
          <div
            ref={cardRef}
            className="relative w-full aspect-video
                      bg-gradient-to-br from-gray-900/80 to-black/80
                      rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm border border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.1)]
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
                    <style jsx>{`
                      @keyframes pulse {
                        0%, 100% {
                          transform: scale(1);
                          opacity: 0.6;
                        }
                        50% {
                          transform: scale(1.1);
                          opacity: 0.3;
                        }
                      }
                    `}</style>
                    <div className="relative flex items-center justify-center">
                      {/* Outer pulsing ring */}
                      <div 
                        className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-purple-400/40"
                        style={{ animation: 'pulse 2s ease-in-out infinite' }}
                      ></div>
                      
                      {/* Hollow transparent ring with gradient border */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full backdrop-blur-md bg-white/10 border-[3px] border-transparent bg-clip-padding group-hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(124,58,237,0.6)] flex items-center justify-center"
                           style={{
                             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(135deg, #a855f7, #7c3aed)',
                             backgroundOrigin: 'border-box',
                             backgroundClip: 'padding-box, border-box',
                           }}>
                        {/* Play icon transparent with white outline */}
                        <svg className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 ml-0.5" viewBox="0 0 24 24" fill="none">
                          <path d="M8 5v14l11-7z" fill="transparent" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </div>
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

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-600/10 blur-[30px] sm:blur-[40px] -z-10 rounded-full pointer-events-none" />
        </div>

      </div>
    </div>
  )
}