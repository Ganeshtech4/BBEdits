"use client";
import Image from "next/image";
import React, { FC, useState } from "react";
import { MdPlayCircleOutline } from "react-icons/md";
import { HiOutlineCollection } from "react-icons/hi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import BundleCheckout from "./BundleCheckout";

type Props = {
  bundle: any;
  setRoute?: any;
  setOpen?: any;
};

const BundleCard: FC<Props> = ({ bundle, setRoute, setOpen: openAuthModal }) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const user = userData?.user;
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const savings =
    bundle.originalPrice && bundle.originalPrice > bundle.price
      ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)
      : 0;

  const totalLectures = (bundle.courses || []).reduce(
    (acc: number, c: any) => acc + (c.courseData?.length || 0),
    0
  );

  const isAlreadyPurchased =
    user &&
    bundle.courses?.length > 0 &&
    bundle.courses.every((course: any) => {
      const courseId = typeof course === "string" ? course : course._id;
      return user.courses?.some(
        (uc: any) => (uc.courseId || uc._id || uc)?.toString() === courseId?.toString()
      );
    });

  const handleBuy = () => {
    if (!user) {
      setRoute?.("Login");
      openAuthModal?.(true);
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <>
      <div className="w-full flex flex-col bg-gradient-to-br from-[#0d0720] to-[#110b2e] border border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.12)] hover:shadow-[0_0_50px_rgba(147,51,234,0.35)] transition-all duration-500 hover:border-purple-500/60 group">
        {/* Thumbnail */}
        {bundle.thumbnail?.url && (
          <div className="w-full h-36 overflow-hidden">
            <Image
              src={bundle.thumbnail.url}
              alt={bundle.name}
              width={400}
              height={144}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        {/* Header */}
        <div className="relative p-5 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineCollection size={18} className="text-purple-400" />
                <span className="text-xs text-purple-400 font-semibold uppercase tracking-widest">
                  Bundle
                </span>
                {savings > 0 && (
                  <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    {savings}% OFF
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white leading-snug group-hover:text-purple-300 transition-colors">
                {bundle.name}
              </h2>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-2">
            {bundle.description}
          </p>
        </div>

        {/* Course list */}
        <div className="p-5 flex-1 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">
            Includes {bundle.courses?.length || 0} courses
          </p>
          {(bundle.courses || []).map((course: any, i: number) => (
            <div key={course._id || i} className="flex items-center gap-3">
              {course.thumbnail?.url && (
                <div className="w-10 h-8 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={course.thumbnail.url}
                    alt={course.name}
                    width={40}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-1.5 min-w-0">
                <MdPlayCircleOutline size={14} className="text-purple-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 truncate">{course.name}</span>
              </div>
            </div>
          ))}
          {totalLectures > 0 && (
            <p className="text-xs text-gray-500 mt-3">{totalLectures} total lectures</p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="p-5 pt-0 border-t border-purple-500/10 mt-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">₹{bundle.price}</span>
                {bundle.originalPrice && bundle.originalPrice > bundle.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{bundle.originalPrice}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-xs text-green-400 mt-0.5">Save ₹{bundle.originalPrice - bundle.price}</p>
              )}
            </div>

            {isAlreadyPurchased ? (
              <span className="text-sm text-green-400 font-semibold border border-green-500/30 rounded-full px-4 py-2">
                ✓ Enrolled
              </span>
            ) : (
              <button
                onClick={handleBuy}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]"
              >
                Buy Bundle
              </button>
            )}
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <BundleCheckout
          bundle={bundle}
          user={user}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  );
};

export default BundleCard;
