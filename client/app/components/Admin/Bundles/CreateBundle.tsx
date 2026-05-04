"use client";
import React, { useState, useEffect } from "react";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useCreateBundleMutation, useEditBundleMutation } from "@/redux/features/bundles/bundlesApi";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import Image from "next/image";

type Props = {
  editData?: any; // when editing an existing bundle
};

const CreateBundle = ({ editData }: Props) => {
  const router = useRouter();
  const { data: coursesData } = useGetAllCoursesQuery({});
  const [createBundle, { isLoading: isCreating }] = useCreateBundleMutation();
  const [editBundle, { isLoading: isEditing }] = useEditBundleMutation();

  const courses = coursesData?.courses || [];
  const isSubmitting = isCreating || isEditing;

  const [bundleData, setBundleData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    isActive: true,
    selectedCourses: [] as string[],
  });

  useEffect(() => {
    if (editData) {
      setBundleData({
        name: editData.name || "",
        description: editData.description || "",
        price: String(editData.price || ""),
        originalPrice: String(editData.originalPrice || ""),
        isActive: editData.isActive !== false,
        selectedCourses: (editData.courses || []).map((c: any) =>
          typeof c === "string" ? c : c._id
        ),
      });
    }
  }, [editData]);

  const toggleCourse = (courseId: string) => {
    setBundleData((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter((id) => id !== courseId)
        : [...prev.selectedCourses, courseId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bundleData.name.trim()) return toast.error("Bundle name is required");
    if (!bundleData.description.trim()) return toast.error("Description is required");
    if (!bundleData.price || Number(bundleData.price) <= 0) return toast.error("Valid price is required");
    if (bundleData.selectedCourses.length < 2) return toast.error("Select at least 2 courses");

    const payload = {
      name: bundleData.name.trim(),
      description: bundleData.description.trim(),
      price: Number(bundleData.price),
      originalPrice: bundleData.originalPrice ? Number(bundleData.originalPrice) : undefined,
      courses: bundleData.selectedCourses,
      isActive: bundleData.isActive,
    };

    try {
      let response: any;
      if (editData) {
        response = await editBundle({ id: editData._id, data: payload });
      } else {
        response = await createBundle(payload);
      }

      if (response.data) {
        toast.success(editData ? "Bundle updated!" : "Bundle created!");
        router.push("/admin/bundles");
      } else if (response.error) {
        toast.error(response.error.data?.message || "Failed to save bundle");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const savings =
    bundleData.originalPrice && bundleData.price
      ? Math.round(
          ((Number(bundleData.originalPrice) - Number(bundleData.price)) /
            Number(bundleData.originalPrice)) *
            100
        )
      : 0;

  return (
    <div className="w-[80%] m-auto mt-12 pb-16">
      <h1 className="text-2xl font-bold dark:text-white text-black mb-8">
        {editData ? "Edit Bundle" : "Create Course Bundle"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-[#1c1c28] border border-purple-500/20 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Bundle Details</h2>

          <div>
            <label className={styles.label}>Bundle Name *</label>
            <input
              type="text"
              placeholder="e.g. Complete Video Editing Masterpack"
              className={styles.input}
              value={bundleData.name}
              onChange={(e) => setBundleData({ ...bundleData, name: e.target.value })}
            />
          </div>

          <div>
            <label className={styles.label}>Description *</label>
            <textarea
              rows={4}
              placeholder="Describe what's included in this bundle…"
              className={`${styles.input} !h-auto py-2`}
              value={bundleData.description}
              onChange={(e) => setBundleData({ ...bundleData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={styles.label}>Bundle Price (₹) *</label>
              <input
                type="number"
                min={0}
                placeholder="999"
                className={styles.input}
                value={bundleData.price}
                onChange={(e) => setBundleData({ ...bundleData, price: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Original / Estimated Price (₹)</label>
              <input
                type="number"
                min={0}
                placeholder="1999"
                className={styles.input}
                value={bundleData.originalPrice}
                onChange={(e) => setBundleData({ ...bundleData, originalPrice: e.target.value })}
              />
              {savings > 0 && (
                <p className="text-xs text-green-400 mt-1">{savings}% savings badge will show</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-300 font-medium">Active (visible to users)</label>
            <button
              type="button"
              onClick={() => setBundleData({ ...bundleData, isActive: !bundleData.isActive })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                bundleData.isActive ? "bg-purple-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  bundleData.isActive ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs ${bundleData.isActive ? "text-green-400" : "text-gray-500"}`}>
              {bundleData.isActive ? "Live" : "Draft"}
            </span>
          </div>
        </div>

        {/* Course Selection */}
        <div className="bg-[#1c1c28] border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Select Courses{" "}
              <span className="text-sm text-gray-400 font-normal">
                ({bundleData.selectedCourses.length} selected — min. 2)
              </span>
            </h2>
          </div>

          {courses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses found. Create courses first.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
              {courses.map((course: any) => {
                const isSelected = bundleData.selectedCourses.includes(course._id);
                return (
                  <button
                    type="button"
                    key={course._id}
                    onClick={() => toggleCourse(course._id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-600/15"
                        : "border-white/10 bg-white/5 hover:border-purple-500/40"
                    }`}
                  >
                    {course.thumbnail?.url && (
                      <div className="w-14 h-10 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={course.thumbnail.url}
                          alt={course.name}
                          width={56}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{course.name}</p>
                      <p className="text-xs text-gray-400">₹{course.price}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? "border-purple-500 bg-purple-500" : "border-gray-500"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/bundles")}
            className="px-8 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving…" : editData ? "Update Bundle" : "Create Bundle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBundle;
