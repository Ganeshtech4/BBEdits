import { apiSlice } from "../api/apiSlice";

export const bundlesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBundles: builder.query({
      query: () => ({
        url: "get-bundles",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAdminAllBundles: builder.query({
      query: () => ({
        url: "get-admin-bundles",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createBundle: builder.mutation({
      query: (data) => ({
        url: "create-bundle",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    editBundle: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-bundle/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    deleteBundle: builder.mutation({
      query: (id) => ({
        url: `delete-bundle/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    createBundleRazorpayOrder: builder.mutation({
      query: (amount) => ({
        url: "bundle/create-razorpay-order",
        method: "POST",
        body: { amount },
        credentials: "include" as const,
      }),
    }),
    createBundleOrder: builder.mutation({
      query: ({ bundleId, payment_info }) => ({
        url: "create-bundle-order",
        method: "POST",
        body: { bundleId, payment_info },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetActiveBundlesQuery,
  useGetAdminAllBundlesQuery,
  useCreateBundleMutation,
  useEditBundleMutation,
  useDeleteBundleMutation,
  useCreateBundleRazorpayOrderMutation,
  useCreateBundleOrderMutation,
} = bundlesApi;
