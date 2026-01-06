"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Terms from "./Terms";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <Heading
        title="Terms & Conditions - BBEdits"
        description="Read our Terms & Conditions to understand the legal terms governing your use of BBEdits learning platform."
        keywords="terms,conditions,bbedits,legal"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Terms />
      <Footer />
    </div>
  );
};

export default Page;
