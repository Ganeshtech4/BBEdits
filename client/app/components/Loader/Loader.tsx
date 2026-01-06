"use client";
import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen" suppressHydrationWarning>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
