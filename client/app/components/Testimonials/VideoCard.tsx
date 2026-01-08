import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
    name: string;
    videoUrl: string;
    thumbnail?: string;
    index?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ name, videoUrl, thumbnail, index = 0 }) => {
    return (
        <motion.div 
            className="relative w-[280px] h-[450px] rounded-xl overflow-hidden cursor-pointer group border border-white/10 bg-black"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
            {/* Thumbnail / Video Placeholder */}
            <div className="absolute inset-0 bg-black">
                {thumbnail ? (
                    <img src={thumbnail} alt={name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <div className="w-full h-full bg-black" />
                )}
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 bg-orange-500/90 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
            </div>

            {/* Gradient Overlay */}
            {/* Gradient Overlay Removed as per user request */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-0" /> */}

            {/* Name Label Removed */}
            {/* <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                <h3 className="text-white font-semibold text-sm tracking-wide">{name}</h3>
            </div> */}

            {/* Wistia Logo Mockup (Optional - matching reference) */}
            <div className="absolute bottom-1 right-2 z-20 opacity-60">
                {/* Simple placeholder for logo if needed, skipping for now to keep clean */}
            </div>
        </motion.div>
    );
};

export default VideoCard;
