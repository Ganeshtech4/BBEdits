import React from 'react';
import InfoCard from './InfoCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
    {
        number: "01.",
        title: "Beginners",
        description: "Perfect for complete beginners who want to learn professional video editing from scratch."
    },
    {
        number: "02.",
        title: "Content Creators",
        description: "Ideal for Instagram Reels, YouTubers, and digital creators who want clean, engaging edits."
    },
    {
        number: "03.",
        title: "Wedding Editors",
        description: "Designed for wedding & event editors who want faster workflows and cinematic-looking videos."
    },
    {
        number: "04.",
        title: "Students & Freelancers",
        description: "Great for students and aspiring freelancers who want to start earning with video editing skills."
    }
];

const WhoIsThisFor = () => {
    return (
        <div className="w-full py-8 sm:py-12 md:py-16 lg:py-20 pt-10 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 bg-[#030014] relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="w-[95%] sm:w-[90%] md:w-[88%] lg:w-[85%] mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider whitespace-nowrap">
                        Is This Course Right for You?
                    </h2>
                    <div className="h-[1px] bg-gray-700 flex-grow ml-2 sm:ml-3 md:ml-4"></div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-12 md:mb-16">
                    {steps.map((step, index) => (
                        <InfoCard
                            key={index}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>

                {/* CTA Bar */}
                <div className="w-full bg-[#2b2d66] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-lg border border-white/5">
                    <h3 className="text-white text-sm sm:text-base md:text-lg font-medium tracking-wide text-center sm:text-left">
                        UPGRADE YOUR EDITING SKILLS NOW
                    </h3>
                    <Link href="/courses">
                        <button className="bg-white text-[#2b2d66] px-5 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 hover:bg-gray-100 transition-all group whitespace-nowrap">
                            Start Now
                            <div className="bg-[#2b2d66] rounded-full p-1 group-hover:translate-x-1 transition-transform duration-300">
                                <ArrowRight size={14} className="text-white" />
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WhoIsThisFor;
