import React from 'react';
import WorkCard from './WorkCard';

const works = [
    { image: '/home/work/work1.webp' },
    { image: '/home/work/2v.webp' },
    { image: '/home/work/3v.webp' },
    { image: '/home/work/4v.webp' },
    { image: '/home/work/5v.webp' },
];

const OurWorks = () => {
    // Duplicate works for seamless infinite scroll
    const allWorks = [...works, ...works];
    
    return (
        <div className="w-full py-8 sm:py-12 md:py-16 lg:py-20 pt-10 sm:pt-12 md:pt-14 lg:pt-16 overflow-hidden relative">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/home/worksbg.jpeg)' }}
            />
            
            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
            
            {/* Subtle Purple Tint Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-violet-900/10" />
            
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-purple-900/10 blur-[100px] sm:blur-[120px] md:blur-[150px] rounded-full pointer-events-none" />
            
            {/* Container with side gaps */}
            <div className="w-full sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[72%] mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10 px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 uppercase tracking-tight">
                        OUR WORKS
                    </h2>
                </div>

                {/* Horizontal Scroll */}
                <div className="relative w-full mb-8 sm:mb-12 md:mb-16" style={{ contain: 'layout style paint' }}>
                    {/* Left and Right Fade */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-black/60 to-transparent z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-black/60 to-transparent z-10" />

                    <div className="overflow-hidden">
                        <div className="flex gap-3 sm:gap-4 md:gap-5 animate-scroll-works hover:animation-paused">
                            {allWorks.map((work, index) => (
                                <WorkCard key={index} index={index} image={work.image} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Subtitle & CTA */}
                <div className="text-center px-4 sm:px-6 md:px-4">
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-7 md:mb-8 uppercase tracking-wider leading-relaxed max-w-2xl mx-auto">
                        Real projects edited with creativity and precision. <br className="hidden sm:block" />
                        From wedding films to reels and client work
                    </p>

                    <button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-sm sm:text-base tracking-wide hover:scale-105 transition-all duration-300 uppercase shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]">
                        Watch Our Work
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OurWorks;
