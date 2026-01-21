import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoCardProps {
    name: string;
    videoUrl: string;
    thumbnail?: string;
    index?: number;
    isPlaying?: boolean;
    onPlay?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ name, videoUrl, thumbnail, index = 0, isPlaying = false, onPlay }) => {
    const handlePlay = () => {
        if (videoUrl && videoUrl !== '#' && onPlay) {
            onPlay();
        }
    };

    return (
        <div
            className="relative w-[280px] h-[450px] rounded-xl overflow-hidden cursor-pointer group border border-white/10 bg-black hover:border-white/20 transition-colors"
            style={{ contain: 'layout paint' }}
            onClick={handlePlay}
        >
            {/* Thumbnail / Video */}
            {!isPlaying ? (
                <>
                    <div className="absolute inset-0 bg-black">
                        {thumbnail ? (
                            <img src={thumbnail} alt={name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
                        ) : (
                            <div className="w-full h-full bg-black" />
                        )}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.6)] group-hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]">
                            <Play className="w-7 h-7 text-white ml-1" fill="white" />
                        </div>
                    </div>
                </>
            ) : (
                /* Video Player - Only load when clicked */
                <div className="absolute inset-0">
                    <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                </div>
            )}

            {/* Name Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white font-semibold text-sm">{name}</p>
            </div>
        </div>
    );
};

export default VideoCard;
