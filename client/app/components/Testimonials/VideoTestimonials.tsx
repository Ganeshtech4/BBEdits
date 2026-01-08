import React from 'react';
import Marquee from '../magic-ui/marquee-base';
import VideoCard from './VideoCard';

const testimonials = [
    {
        name: "Kalidhasan",
        videoUrl: "#",
    },
    {
        name: "Thivagaran",
        videoUrl: "#",
    },
    {
        name: "Manikandan",
        videoUrl: "#",
    },
    {
        name: "Dinesh",
        videoUrl: "#",
    },
    {
        name: "Kumara manikandan",
        videoUrl: "#",
    },
    {
        name: "Bharathiraja",
        videoUrl: "#",
    },
    {
        name: "Sathish",
        videoUrl: "#",
    },
    {
        name: "Raju",
        videoUrl: "#",
    },
];

const VideoTestimonials = () => {
    return (
        <div className="w-full py-20 bg-[#030014] overflow-hidden">
            <div className="text-center mb-12">
                <div className="inline-block px-3 py-1 mb-4 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                    <span className="text-gray-400 text-xs font-medium tracking-wider uppercase">Success Stories</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 pb-2">
                    Real People. <br />
                    Real Transformations.
                </h2>
            </div>

            <div className="relative w-full">
                {/* Left Gradient Fade */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-r from-[#030014] to-transparent pointer-events-none" />

                {/* Right Gradient Fade */}
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-l from-[#030014] to-transparent pointer-events-none" />

                <Marquee pauseOnHover className="[--duration:40s] [--gap:2rem]">
                    {testimonials.map((t, index) => (
                        <VideoCard
                            key={index}
                            name={t.name}
                            videoUrl={t.videoUrl}
                            index={index}
                        />
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default VideoTestimonials;
