import Link from "next/link";
import React, { useState } from "react";

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData &&
          navItemsData.map((i, index) => (
            <Link href={`${i.url}`} key={index} passHref>
              <span
                className={`${activeItem === index
                  ? "text-[#7c3aed]"
                  : "dark:text-white text-black"
                  } text-[18px] px-3 font-Poppins font-[400] relative inline-block overflow-hidden h-[24px] cursor-pointer`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span 
                  className={`inline-block transition-transform duration-300 ease-out ${
                    hoveredIndex === index ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                >
                  {i.name}
                </span>
                <span 
                  className={`absolute left-0 top-full w-full px-3 inline-block transition-transform duration-300 ease-out ${
                    hoveredIndex === index ? '-translate-y-full opacity-100' : 'translate-y-0 opacity-0'
                  }`}
                >
                  {i.name}
                </span>
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href={"/"} passHref>
              <span
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >BBEdits</span>
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((i, index) => (
              <Link href={i.url} passHref key={index}>
                <span
                  className={`${activeItem === index
                    ? "text-[#7c3aed]"
                    : "dark:text-white text-black"
                    } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                >
                  {i.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
