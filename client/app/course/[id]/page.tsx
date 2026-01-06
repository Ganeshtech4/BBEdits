'use client'
import React, { use } from "react";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";


const Page = ({params}:any) => {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams as { id: string };
    return (
        <div>
            <CourseDetailsPage id={id} />
        </div>
    )
}

export default Page;
 