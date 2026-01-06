"use client";
import React, { useState } from "react";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useCreateCouponMutation } from "@/redux/features/coupons/couponsApi";

type Props = {};

const CreateCoupon = (props: Props) => {
  const router = useRouter();
  const { data: coursesData } = useGetAllCoursesQuery({});
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const [couponData, setCouponData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiresAt: "",
    usageLimit: "",
    minPurchaseAmount: "",
    applicableTo: "all",
    applicableCourses: [] as string[],
    description: "",
  });

  const courses = coursesData?.courses || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!couponData.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    if (!couponData.discountValue || Number(couponData.discountValue) <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    if (couponData.discountType === "percentage" && Number(couponData.discountValue) > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    if (!couponData.expiresAt) {
      toast.error("Expiry date is required");
      return;
    }

    if (couponData.applicableTo === "specific" && couponData.applicableCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    try {
      const payload = {
        code: couponData.code.toUpperCase(),
        discountType: couponData.discountType,
        discountValue: Number(couponData.discountValue),
        expiresAt: new Date(couponData.expiresAt).toISOString(),
        usageLimit: couponData.usageLimit ? Number(couponData.usageLimit) : 0,
        minPurchaseAmount: couponData.minPurchaseAmount ? Number(couponData.minPurchaseAmount) : 0,
        applicableCourses: couponData.applicableTo === "all" ? [] : couponData.applicableCourses,
        isActive: true,
      };

      const response: any = await createCoupon(payload);

      if (response.data) {
        toast.success("Coupon created successfully");
        router.push("/admin/coupons");
      } else if (response.error) {
        toast.error(response.error.data?.message || "Failed to create coupon");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create coupon");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setCouponData((prev) => ({
      ...prev,
      applicableCourses: selectedOptions,
    }));
  };

  return (
    <div className="mt-[120px] px-8">
      <h1 className={`${styles.title} text-center mb-8`}>Create Coupon</h1>

      <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto">
        {/* Coupon Code */}
        <div className="mb-6">
          <label htmlFor="code" className={`${styles.label}`}>
            Coupon Code
          </label>
          <input
            type="text"
            name="code"
            id="code"
            required
            value={couponData.code}
            onChange={handleChange}
            placeholder="e.g., SAVE20"
            className={`${styles.input} uppercase`}
          />
        </div>

        {/* Discount Type */}
        <div className="mb-6">
          <label htmlFor="discountType" className={`${styles.label}`}>
            Discount Type
          </label>
          <select
            name="discountType"
            id="discountType"
            value={couponData.discountType}
            onChange={handleChange}
            className={`${styles.input} bg-transparent dark:bg-transparent`}
          >
            <option value="percentage" className="bg-white dark:bg-slate-900 text-black dark:text-white">Percentage (%)</option>
            <option value="fixed" className="bg-white dark:bg-slate-900 text-black dark:text-white">Fixed Amount (₹)</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className="mb-6">
          <label htmlFor="discountValue" className={`${styles.label}`}>
            Discount Value
          </label>
          <input
            type="number"
            name="discountValue"
            id="discountValue"
            required
            value={couponData.discountValue}
            onChange={handleChange}
            placeholder={couponData.discountType === "percentage" ? "e.g., 20" : "e.g., 500"}
            className={`${styles.input}`}
            min="0"
            step={couponData.discountType === "percentage" ? "1" : "0.01"}
            onWheel={(e) => (e.target as HTMLElement).blur()}
          />
        </div>

        {/* Expiry Date */}
        <div className="mb-6">
          <label htmlFor="expiresAt" className={`${styles.label}`}>
            Expiry Date
          </label>
          <input
            type="datetime-local"
            name="expiresAt"
            id="expiresAt"
            required
            value={couponData.expiresAt}
            onChange={handleChange}
            className={`${styles.input}`}
          />
        </div>

        {/* Usage Limit */}
        <div className="mb-6">
          <label htmlFor="usageLimit" className={`${styles.label}`}>
            Usage Limit (Optional)
          </label>
          <input
            type="number"
            name="usageLimit"
            id="usageLimit"
            value={couponData.usageLimit}
            onChange={handleChange}
            placeholder="Leave empty for unlimited"
            className={`${styles.input}`}
            min="0"
            onWheel={(e) => (e.target as HTMLElement).blur()}
          />
        </div>

        {/* Minimum Purchase */}
        <div className="mb-6">
          <label htmlFor="minPurchaseAmount" className={`${styles.label}`}>
            Minimum Purchase Amount (Optional)
          </label>
          <input
            type="number"
            name="minPurchaseAmount"
            id="minPurchaseAmount"
            value={couponData.minPurchaseAmount}
            onChange={handleChange}
            placeholder="e.g., 1000"
            className={`${styles.input}`}
            min="0"
            step="0.01"
            onWheel={(e) => (e.target as HTMLElement).blur()}
          />
        </div>

        {/* Applicable To */}
        <div className="mb-6">
          <label htmlFor="applicableTo" className={`${styles.label}`}>
            Applicable To
          </label>
          <select
            name="applicableTo"
            id="applicableTo"
            value={couponData.applicableTo}
            onChange={handleChange}
            className={`${styles.input} bg-transparent dark:bg-transparent`}
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-black dark:text-white">All Courses</option>
            <option value="specific" className="bg-white dark:bg-slate-900 text-black dark:text-white">Specific Courses</option>
          </select>
        </div>

        {/* Specific Courses Selection */}
        {couponData.applicableTo === "specific" && (
          <div className="mb-6">
            <label htmlFor="applicableCourses" className={`${styles.label}`}>
              Select Courses (Hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              name="applicableCourses"
              id="applicableCourses"
              value={couponData.applicableCourses}
              onChange={handleCourseSelection}
              className={`${styles.input} bg-transparent dark:bg-transparent min-h-[200px]`}
              size={10}
            >
              {courses.map((course: any) => (
                <option
                  key={course._id}
                  value={course._id}
                  className="bg-white dark:bg-slate-900 text-black dark:text-white p-2 hover:bg-blue-100 dark:hover:bg-slate-700"
                >
                  {course.name}
                </option>
              ))}
            </select>
            {couponData.applicableCourses.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected: {couponData.applicableCourses.length} course(s)
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className={`${styles.label}`}>
            Description (Optional)
          </label>
          <textarea
            name="description"
            id="description"
            value={couponData.description}
            onChange={handleChange}
            placeholder="Internal note about this coupon"
            className={`${styles.input} min-h-[100px]`}
            rows={4}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between mt-8 mb-12">
          <button
            type="button"
            onClick={() => router.push("/admin/coupons")}
            className="px-6 py-3 rounded bg-gray-500 hover:bg-gray-600 text-white font-Poppins transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded bg-[#37a39a] hover:bg-[#2d8d85] text-white font-Poppins transition-colors duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
