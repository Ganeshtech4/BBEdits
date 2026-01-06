import { apiSlice } from "../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation({
      query: ({ code, courseId, amount }) => ({
        url: "validate-coupon",
        method: "POST",
        body: {
          code,
          courseId,
          amount,
        },
        credentials: "include" as const,
      }),
    }),
    getAllCoupons: builder.query({
      query: () => ({
        url: "get-coupons",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "create-coupon",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-coupon/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `delete-coupon/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
