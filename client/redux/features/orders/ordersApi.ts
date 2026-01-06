import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getRazorpayKey: builder.query({
      query: () => ({
        url: `payment/razorpaykey`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createRazorpayOrder: builder.mutation({
      query: (amount) => ({
        url: "payment/create-order",
        method: "POST",
        body: {
          amount,
        },
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId, payment_info, couponCode }) => ({
        url: "create-order",
        body: {
          courseId,
          payment_info,
          couponCode,
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetRazorpayKeyQuery, useCreateRazorpayOrderMutation, useCreateOrderMutation } =
  ordersApi;
