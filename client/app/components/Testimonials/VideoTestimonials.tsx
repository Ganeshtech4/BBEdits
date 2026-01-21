import React from 'react';
import VideoCard from './VideoCard';

const testimonials = [
    {
        name: "Kalidhasan",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb1.jpg"
    },
    {
        name: "Thivagaran",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb2.jpg"
    },
    {
        name: "Manikandan",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb3.jpg"
    },
    {
        name: "Dinesh",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb4.jpg"
    },
    {
        name: "Kumara Manikandan",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb5.jpg"
    },
    {
        name: "Bharathiraja",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb6.jpg"
    },
    {
        name: "Sathish",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb7.jpg"
    },
    {
        name: "Raju",
        videoUrl: "#",
        thumbnail: "/testimonials/thumb8.jpg"
    },
];

const VideoTestimonials = () => {
    // Duplicate testimonials for seamless loop
    const allTestimonials = [...testimonials, ...testimonials];

    return (
        <div className="w-full py-20 pt-28 bg-gradient-to-b from-black via-[#030014] to-black overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-16 px-4">
                    <div className="inline-block px-4 py-1.5 mb-6 border border-purple-500/30 rounded-full bg-purple-500/10">
                        <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">Success Stories</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
                        Student Testimonials
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Real people. Real transformations. Hear from our students who mastered video editing.
                    </p>
                </div>

                {/* Continuous Scroll Loop */}
                <div className="relative w-full mb-16" style={{ contain: 'layout style paint' }}>
                    {/* Left and Right Fade */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

                    {/* Scrolling Container */}
                    <div className="overflow-hidden">
                        <div className="flex gap-6 px-6 py-4 animate-scroll-continuous hover:[animation-play-state:paused]">
                            {allTestimonials.map((testimonial, index) => (
                                <div key={index} className="flex-shrink-0">
                                    <VideoCard
                                        name={testimonial.name}
                                        videoUrl={testimonial.videoUrl}
                                        thumbnail={testimonial.thumbnail}
                                        index={index}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center px-4">
                    <p className="text-gray-400 text-base mb-6">
                        Join thousands of students who transformed their editing skills
                    </p>
                    <button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-10 py-4 rounded-full font-bold text-base tracking-wide hover:scale-105 transition-all duration-300 uppercase shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]">
                        Start Your Journey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoTestimonials;
