"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import socketIO from "socket.io-client";
import { useGetRazorpayKeyQuery } from "@/redux/features/orders/ordersApi";
import {
  useCreateBundleRazorpayOrderMutation,
  useCreateBundleOrderMutation,
} from "@/redux/features/bundles/bundlesApi";
import { styles } from "@/app/styles/style";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  bundle: any;
  user: any;
  onClose: () => void;
};

const BundleCheckout = ({ bundle, user, onClose }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: razorpayKeyData } = useGetRazorpayKeyQuery({});
  const [createBundleRazorpayOrder] = useCreateBundleRazorpayOrderMutation();
  const [createBundleOrder, { data: orderData, error }] = useCreateBundleOrderMutation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (orderData) {
      toast.success("Bundle purchased! You're now enrolled in all courses.");
      socketId.emit("notification", {
        title: "New Bundle Order",
        message: `New bundle purchase: ${bundle.name}`,
        userId: user._id,
      });
      onClose();
      // Redirect to the first course in the bundle
      const firstCourseId =
        bundle.courses?.[0]?._id || bundle.courses?.[0];
      if (firstCourseId) {
        router.push(`/course-access/${firstCourseId}`);
      } else {
        router.push("/profile");
      }
    }
    if (error && "data" in error) {
      toast.error((error as any).data?.message || "Order creation failed");
    }
  }, [orderData, error]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const orderResponse: any = await createBundleRazorpayOrder(bundle.price);
      if (!orderResponse.data?.order) {
        toast.error("Failed to create payment order");
        setIsLoading(false);
        return;
      }

      const razorpayOrder = orderResponse.data.order;

      const options = {
        key: razorpayKeyData?.razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "BB Edits Platform",
        description: bundle.name,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            await createBundleOrder({
              bundleId: bundle._id,
              payment_info: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            toast.success("Payment successful!");
          } catch (err: any) {
            toast.error("Order creation failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#7c3aed" },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsLoading(false);

      razorpay.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setIsLoading(false);
      });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0d0720] border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-md p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-black dark:text-white mb-1 text-center">
          {bundle.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
          Enroll in {bundle.courses?.length || 0} courses
        </p>

        <div className="flex justify-center items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold text-black dark:text-white">
            ₹{bundle.price}
          </span>
          {bundle.originalPrice && bundle.originalPrice > bundle.price && (
            <span className="text-lg text-gray-400 line-through">
              ₹{bundle.originalPrice}
            </span>
          )}
        </div>

        <button
          disabled={isLoading}
          onClick={handlePayment}
          className={`${styles.button} !w-full !h-[45px] text-[18px]`}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default BundleCheckout;
