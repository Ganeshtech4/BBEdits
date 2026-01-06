"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RefundPolicy from "./RefundPolicy";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <Heading
        title="Cancellation & Refund Policy - BBEdits"
        description="Learn about BBEdits cancellation and refund policy for online courses. Understand your rights and our procedures for course returns."
        keywords="refund policy,cancellation,bbedits,returns"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <RefundPolicy />
      <Footer />
    </div>
  );
};

export default Page;
