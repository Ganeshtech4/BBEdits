"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import HireFromUs from "../components/hirefromus/HireFromUs";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Hire From Us - BBEdits"
        description="Hire skilled video editors trained by industry experts. Access a curated pool of job-ready professionals with proven expertise."
        keywords="video editing, hire editors, video production, creative talent"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <HireFromUs />
      <Footer />
    </div>
  );
};

export default Page;
