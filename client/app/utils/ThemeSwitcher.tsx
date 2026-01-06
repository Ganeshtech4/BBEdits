"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      {theme === "light" ? (
        <button
          onClick={() => setTheme("dark")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          aria-label="Switch to dark mode"
        >
          <BiMoon
            className="cursor-pointer text-gray-700 group-hover:text-[#37a39a] transition-colors"
            size={22}
          />
        </button>
      ) : (
        <button
          onClick={() => setTheme("light")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          aria-label="Switch to light mode"
        >
          <BiSun
            size={22}
            className="cursor-pointer text-yellow-400 group-hover:text-yellow-300 transition-colors"
          />
        </button>
      )}
    </div>
  );
};
