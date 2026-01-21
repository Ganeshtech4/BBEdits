import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}
      className="group"
    >
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-purple-900/10 via-black/50 to-black/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.15)] hover:shadow-[0_0_50px_rgba(147,51,234,0.4)] transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-purple-900/20 to-black">
          <Image
            src={item.thumbnail.url}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            alt={item.name}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Discount badge */}
          {item.price > 0 && item.estimatedPrice > item.price && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {Math.round(((item.estimatedPrice - item.price) / item.estimatedPrice) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Title */}
          <h1 className="font-semibold text-lg text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300 min-h-[3.5rem]">
            {item.name}
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <AiOutlineUnorderedList size={16} className="text-purple-400" />
              <span>{item.courseData?.length || 0} Lectures</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-purple-500/20 pt-4 mt-auto">
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h3 className="text-white font-bold text-2xl">
                  {item.price === 0 ? (
                    <span className="text-green-400">Free</span>
                  ) : (
                    <span className="text-white">₹{item.price}</span>
                  )}
                </h3>
                {item.price > 0 && item.estimatedPrice > item.price && (
                  <h5 className="text-sm line-through text-gray-500">
                    ₹{item.estimatedPrice}
                  </h5>
                )}
              </div>
              
              {/* CTA Arrow */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
