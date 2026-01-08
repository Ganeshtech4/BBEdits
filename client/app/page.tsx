"use client";
import React, { FC, useEffect, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import { HomeHero } from "./components/hero";
import Marquee from "./components/magic-ui/Marquee";
import VideoTestimonials from "./components/Testimonials/VideoTestimonials";
import WhoIsThisFor from "./components/WhoIsThisFor/WhoIsThisFor";
import OurWorks from "./components/OurWorks/OurWorks";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import Footer from "./components/Footer";
import ScrollStackCards from "./components/ScrollStackCards/ScrollStackCards";

interface Props { }

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <>
      <Heading
        title="BBEdits"
        description="BBEdits is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <div suppressHydrationWarning>
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <HomeHero />
        <ScrollStackCards />
        <Courses />
        {/* <Reviews /> */}
        <OurWorks />
        <WhoIsThisFor />
        <VideoTestimonials />
        <Marquee />
        <Footer />
      </div>
    </>
  );
};

export default Page;
