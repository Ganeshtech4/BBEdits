"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useGetActiveBundlesQuery } from "@/redux/features/bundles/bundlesApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import BundleCard from "../components/Bundle/BundleCard";
import Footer from "../components/Footer";

type Props = {};

const CoursesContent = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const { data: bundlesData } = useGetActiveBundlesQuery({});
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setcourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setcourses(data?.courses);
    }
    if (category !== "All") {
      setcourses(
        data?.courses.filter((item: any) => item.categories === category)
      );
    }
    if (search) {
      setcourses(
        data?.courses.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh] pt-32">
            {/* Bundles Section — shown first */}
            {bundlesData?.bundles?.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Course Bundles
                  </h2>
                  <span className="bg-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                    Save More
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px]">
                  {bundlesData.bundles.map((bundle: any) => (
                    <BundleCard
                      key={bundle._id}
                      bundle={bundle}
                      setRoute={setRoute}
                      setOpen={setOpen}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Courses Section */}
            {bundlesData?.bundles?.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">All Courses</h2>
              </div>
            )}
            {
                courses && courses.length === 0 && (
                    <p className={`${styles.label} justify-center min-h-[50vh] flex items-center`}>
                    {search ? "No courses found!" : "No courses found in this category. Please try another one!"}
                  </p>
                )
            }
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0 mt-8">
              {courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <CoursesContent />
    </Suspense>
  );
};

export default Page;
