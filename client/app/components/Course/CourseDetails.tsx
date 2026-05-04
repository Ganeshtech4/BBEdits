"use client";

import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import RazorpayCheckout from "../Payment/RazorpayCheckout";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useValidateCouponMutation } from "@/redux/features/coupons/couponsApi";
import toast from "react-hot-toast";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaInfinity, FaChevronRight } from "react-icons/fa";
import { MdOndemandVideo, MdLanguage } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Ratings from "@/app/utils/Ratings";

type Props = {
  data: any;
  setRoute: any;
  setOpen: any;
};

const CourseDetails = ({
  data,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const { data: userData,refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [validateCoupon] = useValidateCouponMutation();

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const dicountPercentenge =
    ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id || item.courseId === data._id);

  const finalPrice = appliedCoupon ? appliedCoupon.finalAmount : data.price;

  // Calculate total duration
  const totalDuration = data?.courseData?.reduce((acc: number, item: any) => {
    return acc + (item.videoLength || 0);
  }, 0) || 0;

  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = Math.round(totalDuration % 60);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const response: any = await validateCoupon({
        code: couponCode,
        courseId: data._id,
        amount: data.price,
      });

      if (response.data) {
        setAppliedCoupon(response.data.coupon);
        toast.success("Coupon applied successfully!");
      } else if (response.error) {
        toast.error(response.error.data.message || "Invalid coupon code");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleOrder = (e: any) => {
    if (user) {
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A19]">
      {/* Hero Section with Video - Purple gradient background */}
      <div className="relative bg-gradient-to-br from-purple-900/30 via-[#1a0d2e] to-black border-b border-purple-500/10">
        <div className="w-[90%] 800px:w-[85%] max-w-[1400px] m-auto py-8 pt-24">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 text-gray-400">
            <Link href="/courses" className="hover:text-purple-400 transition-colors">
              Courses
            </Link>
            <FaChevronRight size={10} />
            <span className="text-purple-400">{data?.categories || 'Video Editing'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {data.name}
              </h1>
              
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {data.description?.substring(0, 150)}...
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MdLanguage className="text-purple-400" size={18} />
                  <span>English</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOndemandVideo className="text-purple-400" size={18} />
                  <span>{data?.courseData?.length || 0} lectures</span>
                </div>
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">â±</span>
                    <span>{totalHours}h {totalMinutes}m total</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Preview removed from hero - will be in sidebar */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[90%] 800px:w-[85%] max-w-[1400px] m-auto py-12 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            
            {/* What You'll Learn */}
            <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.benefits?.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <IoCheckmarkDoneOutline size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-white">Course content</h2>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{data?.courseData?.length || 0} sections</span>
                  <span>•</span>
                  <span>{data?.courseData?.reduce((acc: number) => acc + 1, 0)} lectures</span>
                  {totalDuration > 0 && (
                    <>
                      <span>•</span>
                      <span>{totalHours}h {totalMinutes}m total length</span>
                    </>
                  )}
                </div>
              </div>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>

            {/* Requirements */}
            {data.prerequisites && data.prerequisites.length > 0 && (
              <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {data.prerequisites.map((item: any, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-purple-400 mt-1">•</span>
                      <span className="text-sm">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {data.description}
              </div>
            </div>

            {/* Reviews */}
            {data?.reviews && data.reviews.length > 0 && (
              <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Student feedback</h2>
                <div className="space-y-6">
                  {[...data.reviews].reverse().map((item: any, index: number) => (
                    <div key={index} className="border-b border-purple-500/20 last:border-0 pb-6 last:pb-0">
                      <div className="flex gap-4">
                        <Image
                          src={item.user.avatar?.url || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                          width={48}
                          height={48}
                          alt={item.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-white">{item.user.name}</h5>
                          </div>
                          <p className="text-gray-300 text-sm mb-1">{item.comment}</p>
                          <span className="text-xs text-gray-500">{format(item.createdAt)}</span>
                          
                          {item.commentReplies?.map((reply: any, idx: number) => (
                            <div key={idx} className="mt-4 ml-4 pl-4 border-l-2 border-purple-500/30 bg-purple-900/20 p-3 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <Image
                                  src={reply.user.avatar?.url || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                                  width={32}
                                  height={32}
                                  alt={reply.user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <h6 className="font-semibold text-sm text-white">{reply.user.name}</h6>
                                <VscVerifiedFilled className="text-purple-400" size={14} />
                              </div>
                              <p className="text-sm text-gray-300">{reply.comment}</p>
                              <span className="text-xs text-gray-500">{format(reply.createdAt)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Scrollable */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            {/* Sticky wrapper for desktop */}
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-purple-500/30">
                <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              </div>

              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-baseline gap-3 mb-4">
                  <h1 className="text-4xl font-bold text-white">
                    {data.price === 0 ? "Free" : `₹${data.price}`}
                  </h1>
                  {data.price > 0 && data.estimatedPrice > data.price && (
                    <>
                      <span className="text-lg line-through text-gray-500">₹{data.estimatedPrice}</span>
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                        {discountPercentengePrice}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Coupon */}
                {!isPurchased && data.price > 0 && (
                  <div className="mb-4">
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 px-4 py-2.5 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                          className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-colors"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm text-green-700 font-medium">
                              Coupon: {appliedCoupon.code}
                            </p>
                            <p className="text-sm text-green-600">
                              Saved: â‚¹{appliedCoupon.discountAmount.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-lg font-bold text-green-700">
                          Final: â‚¹{appliedCoupon.finalAmount.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Button - Hidden on mobile, shown in fixed bottom */}
                <div className="hidden lg:block">
                  {isPurchased ? (
                    <Link
                      href={`/course-access/${data._id}`}
                      className="block w-full py-3.5 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-base transition-colors shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                    >
                      Go to course
                    </Link>
                  ) : (
                    <button
                      onClick={handleOrder}
                      className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-base transition-colors shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                    >
                      {data.price === 0 ? "Enroll Now" : `Buy now for ₹${finalPrice}`}
                    </button>
                  )}
                </div>

                {/* Course Includes */}
                <div className="mt-6 pt-6 border-t border-purple-500/30 space-y-3">
                  <h4 className="font-bold text-white text-sm mb-3">This course includes:</h4>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <MdOndemandVideo size={20} className="text-purple-400" />
                    <span>{data.courseData?.length || 0} on-demand videos</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <FaInfinity size={20} className="text-purple-400" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <BiSupport size={20} className="text-purple-400" />
                    <span>Premium Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#0F0A19] to-transparent border-t border-purple-500/30 p-4 z-40">
        <div className="w-full max-w-md mx-auto">
          {isPurchased ? (
            <Link
              href={`/course-access/${data._id}`}
              className="block w-full py-4 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-purple-500/30"
            >
              Go to course
            </Link>
          ) : (
            <button
              onClick={handleOrder}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-purple-500/30"
            >
              {data.price === 0 ? "Enroll Now" : `Buy now for ₹${finalPrice}`}
            </button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a0d2e] via-black to-[#0F0A19] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-b border-purple-500/30 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Complete Your Purchase</h3>
              <button 
                onClick={() => setOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-purple-500/20 rounded-lg"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <RazorpayCheckout 
                setOpen={setOpen} 
                data={data} 
                user={user} 
                refetch={refetch} 
                appliedCoupon={appliedCoupon}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
