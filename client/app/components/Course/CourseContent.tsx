import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import CourseContentList from "./CourseContentList";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  user:any;
};

const CourseContent = ({ id,user }: Props) => {
  const router = useRouter();
  const { data: contentData, isLoading,refetch } = useGetCourseContentQuery(id,{refetchOnMountOrArgChange:true});
  const data = contentData?.content;

  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Fullscreen Header with Back Button */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                <IoArrowBack size={20} />
                <span className="font-medium">Back to Courses</span>
              </button>
              <h1 className="text-lg font-semibold text-black dark:text-white">
                {data && data[activeVideo]?.title}
              </h1>
              <div className="w-[140px]"></div>
            </div>
          </div>

          <div className="w-full grid 800px:grid-cols-10 pt-[80px]">
            <Heading
              title={data && data[activeVideo]?.title || "Course Content"}
              description="BB Edits Course Content"
              keywords={data && data[activeVideo]?.tags || ""}
            />
            <div className="col-span-7">
              <CourseContentMedia
                data={data}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user}
                refetch={refetch}
              />
            </div>
            <div className="hidden 800px:block 800px:col-span-3">
            <CourseContentList
              setActiveVideo={setActiveVideo}
              data={data}
              activeVideo={activeVideo}
            />
          </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourseContent;
