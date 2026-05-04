import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdPlayCircleOutline } from "react-icons/md";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  const discountPct =
    item.price > 0 && item.estimatedPrice > item.price
      ? Math.round(((item.estimatedPrice - item.price) / item.estimatedPrice) * 100)
      : 0;

  // Pull up to 3 benefit titles as highlight points
  const highlights: string[] = (item.benefits || [])
    .slice(0, 3)
    .map((b: any) => b.title);

  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}
      className="group"
    >
      <div className="w-full h-full flex flex-col bg-[#0d0720] border border-purple-500/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.1)] hover:shadow-[0_0_50px_rgba(147,51,234,0.35)] transition-all duration-500 hover:border-purple-500/50">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={item.thumbnail.url}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            alt={item.name}
          />
          {/* Bottom-fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0720] via-black/20 to-transparent" />

          {/* Discount badge */}
          {discountPct > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg tracking-wide">
              {discountPct}% OFF
            </div>
          )}

          {/* Lecture count pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-gray-300 text-xs px-2.5 py-1 rounded-full border border-purple-500/20">
            <MdPlayCircleOutline size={14} className="text-purple-400" />
            <span>{item.courseData?.length || 0} Lectures</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title */}
          <h1 className="font-bold text-base text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300 leading-snug">
            {item.name}
          </h1>

          {/* Short description */}
          {item.description && (
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
              {item.description}
            </p>
          )}

          {/* Highlight points */}
          {highlights.length > 0 && (
            <ul className="space-y-1 mb-4">
              {highlights.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-xs">
                  <IoCheckmarkDone size={14} className="text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{point}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Spacer pushes price to bottom */}
          <div className="mt-auto pt-4 border-t border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold text-2xl">
                  {item.price === 0 ? (
                    <span className="text-green-400">Free</span>
                  ) : (
                    `₹${item.price}`
                  )}
                </span>
                {item.price > 0 && item.estimatedPrice > item.price && (
                  <span className="text-sm line-through text-gray-500">
                    ₹{item.estimatedPrice}
                  </span>
                )}
              </div>

              {/* CTA Arrow */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                <svg className="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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

