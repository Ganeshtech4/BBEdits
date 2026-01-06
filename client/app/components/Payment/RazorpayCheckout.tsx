import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useGetRazorpayKeyQuery,
} from "@/redux/features/orders/ordersApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: any;
  data: any;
  user: any;
  refetch: any;
  appliedCoupon?: any;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCheckout = ({ data, user, refetch, setOpen, appliedCoupon }: Props) => {
  const router = useRouter();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const { data: razorpayKeyData } = useGetRazorpayKeyQuery({});
  const [isLoading, setIsLoading] = useState(false);

  const finalPrice = appliedCoupon ? appliedCoupon.finalAmount : data.price;

  useEffect(() => {
    // Load Razorpay script
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
      refetch();
      socketId.emit("notification", {
        title: "New Order",
        message: `You have a new order from ${data.name}`,
        userId: user._id,
      });
      router.push(`/course-access/${data._id}`);
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [orderData, error]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Create Razorpay order with final price (after coupon discount)
      const orderResponse: any = await createRazorpayOrder(finalPrice);

      if (!orderResponse.data?.order) {
        toast.error("Failed to create order");
        setIsLoading(false);
        return;
      }

      const razorpayOrder = orderResponse.data.order;

      const options = {
        key: razorpayKeyData?.razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "BB Edits Platform",
        description: data.name,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Payment successful, create order in backend
            await createOrder({
              courseId: data._id,
              payment_info: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              couponCode: appliedCoupon?.code,
            });
            toast.success("Payment successful!");
            setOpen(false);
          } catch (error: any) {
            toast.error("Order creation failed");
            console.error(error);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsLoading(false);

      razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        setIsLoading(false);
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-5">
      <div className="w-full mb-5">
        <h1 className="text-[25px] font-Poppins font-[600] text-center text-black dark:text-white mb-3">
          {data.name}
        </h1>
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-[30px] font-Poppins font-[600] text-black dark:text-white">
            ₹{finalPrice}
          </h2>
          {data.estimatedPrice && (
            <h3 className="text-[20px] font-Poppins line-through opacity-60 ml-3 text-black dark:text-white">
              ₹{data.estimatedPrice}
            </h3>
          )}
        </div>
        {appliedCoupon && (
          <div className="text-center">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Coupon "{appliedCoupon.code}" Applied!
            </p>
            <p className="text-sm text-black dark:text-white">
              Original Price: ₹{data.price} | Discount: ₹{appliedCoupon.discountAmount.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <button
        disabled={isLoading}
        onClick={handlePayment}
        className={`${styles.button} !w-full !h-[45px] text-[18px]`}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>

      <p className="text-[14px] text-center mt-5 text-black dark:text-white opacity-80">
        Secure payment powered by Razorpay
      </p>
    </div>
  );
};

export default RazorpayCheckout;
