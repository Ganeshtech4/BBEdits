"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const {data:userData,isLoading,refetch} = useLoadUserQuery(undefined,{});
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if(!isLoading){
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data.user?.image,
          });
        }
      }
      if(data === null){
        if(isSuccess){
          toast.success("Login Successfully");
        }
      }
      if(data === null && !isLoading && !userData){
          setLogout(true);
      }
    }
  }, [data, userData,isLoading]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully");
      refetch();
    }
    if (error) {
      console.log("Social auth error:", error);
      if ('data' in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message || "Login failed");
      }
    }
  }, [isSuccess, error]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };

  return (
   <>
   {
    isLoading ? (
      <Loader />
    ) : (
      <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-95 bg-white/95 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-lg backdrop-blur-md transition-all duration-300"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow backdrop-blur-sm"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto h-full">
          <div className="w-full h-[80px] flex items-center justify-between px-2 800px:px-0">
            {/* Logo */}
            <div>
              <Link
                href={"/"}
                className="group flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/images/anil-logo.png"
                    alt="BBEdits Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[22px] 800px:text-[25px] font-Poppins font-[600] text-black dark:text-white group-hover:text-[#37a39a] dark:group-hover:text-[#37a39a] transition-colors duration-300">
                  BBedits
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-3 800px:gap-4">
              <NavItems activeItem={activeItem} isMobile={false} />
              
              {/* Theme Switcher */}
              <div className="ml-2">
                <ThemeSwitcher />
              </div>

              {/* Desktop User Section */}
              {userData ? (
                <Link href="/profile" className="hidden 800px:block ml-2">
                  <div className="relative group">
                    <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                      activeItem === 5 
                        ? "border-[#37a39a] shadow-md shadow-[#37a39a]/50" 
                        : "border-gray-300 dark:border-gray-600 group-hover:border-[#37a39a]"
                    }`}>
                      <Image
                        src={userData?.user.avatar ? userData.user.avatar.url : avatar}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => setOpen(true)}
                  className="hidden 800px:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#37a39a] to-[#2d8f85] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  <HiOutlineUserCircle size={20} />
                  <span className="text-sm">Sign In</span>
                </button>
              )}

              {/* Mobile Menu Section */}
              <div className="800px:hidden flex items-center gap-2 ml-2">
                {!userData && (
                  <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <HiOutlineUserCircle
                      size={24}
                      className="text-black dark:text-white"
                    />
                  </button>
                )}
                {userData && (
                  <Link href="/profile">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                      <Image
                        src={userData?.user.avatar ? userData.user.avatar.url : avatar}
                        alt="User"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                )}
                <button
                  onClick={() => setOpenSidebar(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <HiOutlineMenuAlt3
                    size={24}
                    className="text-black dark:text-white"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[75%] max-w-[320px] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 top-0 right-0 shadow-2xl animate-slideInRight">
              {/* Mobile Sidebar Header */}
              <div className="p-5 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src="/images/anil-logo.png"
                      alt="BBEdits Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">BBEdits</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Learning Platform</p>
                  </div>
                </div>
              </div>

              {/* User Info in Mobile Sidebar */}
              {userData?.user && (
                <Link href="/profile" onClick={() => setOpenSidebar(false)}>
                  <div className="p-5 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                        activeItem === 5 ? "border-[#37a39a]" : "border-gray-300 dark:border-gray-600"
                      }`}>
                        <Image
                          src={userData.user.avatar ? userData.user.avatar.url : avatar}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-black dark:text-white">{userData.user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Navigation Items */}
              <div className="py-3">
                <NavItems activeItem={activeItem} isMobile={true} />
              </div>

              {/* Login Button for Mobile (if not logged in) */}
              {!userData && (
                <div className="p-5">
                  <button
                    onClick={() => { 
                      setOpen(true); 
                      setOpenSidebar(false); 
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#37a39a] to-[#2d8f85] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <HiOutlineUserCircle size={22} />
                    <span>Sign In / Sign Up</span>
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  © 2025 BBEdits. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
        </>
      )}

      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}

      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
    )
   }
   </>
  );
};

export default Header;
