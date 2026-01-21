import React from 'react';
import Image from 'next/image';

interface WorkCardProps {
    videoUrl?: string;
    thumbnail?: string;
    index?: number;
    image?: string;
}

const WorkCard: React.FC<WorkCardProps> = ({ videoUrl, thumbnail, index = 0, image }) => {
    return (
        <div className="relative min-w-[260px] md:min-w-[300px] h-[165px] md:h-[185px] overflow-hidden rounded-xl cursor-pointer group bg-black/40 border border-purple-500/10 hover:border-purple-500/30 hover:scale-105 transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(147,51,234,0.4)]" style={{ contain: 'layout paint' }}>
            {/* Video / Thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
                {
                    image ? (
                        <Image
                            src={image}
                            fill
                            sizes="(max-width: 768px) 70vw, 450px"
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                            alt={`Work ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                        />
                    ) : videoUrl ? (
                        <video
                            src={videoUrl}
                            poster={thumbnail}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                        />
                    ) : (
                        /* Placeholder visual */
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-black group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                            <div className="text-white/30 font-bold text-2xl uppercase tracking-widest">
                                Work {index + 1}
                            </div>
                        </div>
                    )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
    );
};

export default WorkCard;
