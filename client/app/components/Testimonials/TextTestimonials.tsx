import React, { useRef, useState, useEffect } from 'react';

const reviews = [
    {
        name: "Rajesh Kumar",
        role: "Content Creator",
        text: "This course transformed my editing skills completely. Now I'm getting paid projects!",
        rating: 5
    },
    {
        name: "Priya Sharma",
        role: "YouTuber",
        text: "Best investment I made for my channel. The techniques are industry-standard.",
        rating: 5
    },
    {
        name: "Arun Patel",
        role: "Freelancer",
        text: "From zero to pro in just 3 months. The instructor explains everything so clearly.",
        rating: 5
    },
    {
        name: "Sneha Reddy",
        role: "Student",
        text: "Amazing course! I landed my first freelance gig within 2 weeks of completing it.",
        rating: 5
    },
    {
        name: "Vikram Singh",
        role: "Wedding Editor",
        text: "The wedding editing module alone was worth the price. My clients love the results!",
        rating: 5
    },
    {
        name: "Meera Krishnan",
        role: "Instagram Creator",
        text: "My reels quality improved drastically. Gained 50k followers in 2 months!",
        rating: 5
    },
    {
        name: "Arjun Nair",
        role: "Video Editor",
        text: "Professional techniques that actually work. Highly recommend to everyone!",
        rating: 5
    },
    {
        name: "Divya Menon",
        role: "Filmmaker",
        text: "This course is a goldmine. Learning from real-world projects made all the difference.",
        rating: 5
    }
];

const secondRowReviews = [
    {
        name: "Karthik Iyer",
        role: "Content Producer",
        text: "Workflow tips alone saved me hours every day. Worth every penny!",
        rating: 5
    },
    {
        name: "Anjali Gupta",
        role: "Social Media Manager",
        text: "Now I edit all our brand videos in-house. No more outsourcing!",
        rating: 5
    },
    {
        name: "Rohit Verma",
        role: "Vlogger",
        text: "The color grading section was mind-blowing. My videos look cinematic now.",
        rating: 5
    },
    {
        name: "Lakshmi Pillai",
        role: "Entrepreneur",
        text: "Started my own editing service after this course. Already have 10+ clients!",
        rating: 5
    },
    {
        name: "Siddharth Rao",
        role: "Music Producer",
        text: "Perfect for creating music videos. The effects tutorials are incredible.",
        rating: 5
    },
    {
        name: "Pooja Desai",
        role: "Travel Blogger",
        text: "My travel videos went viral after applying these techniques. Thank you!",
        rating: 5
    },
    {
        name: "Naveen Kumar",
        role: "Corporate Trainer",
        text: "Use these skills for training videos. Professional results every time.",
        rating: 5
    },
    {
        name: "Isha Malhotra",
        role: "Fashion Influencer",
        text: "My fashion reels look so polished now. Brands are reaching out to me!",
        rating: 5
    }
];

const ReviewCard = ({ name, role, text, rating }: { name: string; role: string; text: string; rating: number }) => (
    <div className="flex-shrink-0 w-[400px] bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 rounded-2xl p-6 mx-3">
        <div className="flex items-center gap-1 mb-3">
            {[...Array(rating)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            ))}
        </div>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">&ldquo;{text}&rdquo;</p>
        <div>
            <p className="text-white font-semibold text-sm">{name}</p>
            <p className="text-purple-400 text-xs">{role}</p>
        </div>
    </div>
);

const MarqueeRow = ({ reviews, direction }: { reviews: any[], direction: 'left' | 'right' }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!rowRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - rowRef.current.offsetLeft);
        setScrollLeft(rowRef.current.scrollLeft);
        rowRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !rowRef.current) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        rowRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (rowRef.current) {
            rowRef.current.style.cursor = 'grab';
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        if (rowRef.current) {
            rowRef.current.style.cursor = 'grab';
        }
    };

    return (
        <div 
            ref={rowRef}
            className="overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`flex ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}>
                {reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                ))}
            </div>
        </div>
    );
};

const TextTestimonials = () => {
    // Duplicate for seamless loop
    const firstRow = [...reviews, ...reviews];
    const secondRow = [...secondRowReviews, ...secondRowReviews];

    return (
        <div className="w-full py-20 pt-28 bg-black overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-16 px-4">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
                        What Our Students Say
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Join thousands of satisfied students who transformed their editing careers
                    </p>
                </div>

                {/* First Row - Left to Right */}
                <div className="mb-8">
                    <MarqueeRow reviews={firstRow} direction="left" />
                </div>

                {/* Second Row - Right to Left */}
                <div>
                    <MarqueeRow reviews={secondRow} direction="right" />
                </div>
            </div>
        </div>
    );
};

export default TextTestimonials;
