"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineUser,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import {signIn} from "next-auth/react";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register,{data,error,isSuccess,isLoading}] = useRegisterMutation(); 

  useEffect(() => {
   if(isSuccess){
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
   }
   if(error){
    if("data" in error){
      const errorData = error as any;
      toast.error(errorData.data.message);
    }
   }
  }, [isSuccess,error]);
  

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({name, email, password }) => {
      const data = {
        name,email,password
      };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full px-2">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Start your learning journey with BBEdits
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              id="name"
              placeholder="John Doe"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#37a39a] ${
                errors.name && touched.name 
                  ? "border-red-500" 
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
          </div>
          {errors.name && touched.name && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              id="email"
              placeholder="your@email.com"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#37a39a] ${
                errors.email && touched.email 
                  ? "border-red-500" 
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={!show ? "password" : "text"}
              name="password"
              value={values.password}
              onChange={handleChange}
              id="password"
              placeholder="••••••••"
              className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#37a39a] ${
                errors.password && touched.password 
                  ? "border-red-500" 
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {!show ? (
              <AiOutlineEyeInvisible
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                size={20}
                onClick={() => setShow(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                size={20}
                onClick={() => setShow(false)}
              />
            )}
          </div>
          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.password}
            </p>
          )}
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#37a39a] to-[#2d8f85] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full py-3 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md group"
        >
          <FcGoogle size={24} />
          <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">
            Sign up with Google
          </span>
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-[#37a39a] font-semibold cursor-pointer hover:underline"
            onClick={() => setRoute("Login")}
          >
            Sign in now
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
