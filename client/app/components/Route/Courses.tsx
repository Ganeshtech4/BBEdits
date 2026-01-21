import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);

  return (
    <div className="w-full min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 pt-10 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 bg-gradient-to-b from-black via-[#030014] to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-purple-900/10 blur-[100px] sm:blur-[120px] md:blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-violet-900/10 blur-[100px] sm:blur-[120px] md:blur-[150px] rounded-full pointer-events-none" />
      
      <div className="w-[95%] sm:w-[90%] md:w-[88%] lg:w-[85%] mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-5 md:mb-6 uppercase tracking-tight leading-tight">
            Master Video Editing
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600 font-semibold mb-3 sm:mb-4">
            Expand Your Career Opportunity
          </p>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            Learn professional video editing techniques from industry experts. From beginner to advanced level courses.
          </p>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-7 lg:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8 sm:mb-10 md:mb-12">
            {courses &&
              courses.map((item: any, index: number) => (
                <CourseCard item={item} key={index} />
              ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!courses || courses.length === 0) && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <p className="text-gray-400 text-base sm:text-lg md:text-xl">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
