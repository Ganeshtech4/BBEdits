import { apiSlice } from "../api/apiSlice";

export const assetsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin
    getAdminAssets: builder.query({
      query: () => ({
        url: "get-admin-assets",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createAsset: builder.mutation({
      query: (data) => ({
        url: "create-asset",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    updateAsset: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `update-asset/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    deleteAsset: builder.mutation({
      query: (id) => ({
        url: `delete-asset/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    // User
    getPublishedAssets: builder.query({
      query: () => ({
        url: "get-assets",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getPublishedAssetById: builder.query({
      query: (id: string) => ({
        url: `get-asset/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAssetDownloadUrl: builder.query({
      query: (id) => ({
        url: `get-asset-download/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createAssetPaymentOrder: builder.mutation({
      query: (id) => ({
        url: `asset-payment/create-order/${id}`,
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    purchaseAsset: builder.mutation({
      query: ({ id, ...paymentInfo }) => ({
        url: `purchase-asset/${id}`,
        method: "POST",
        body: paymentInfo,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAdminAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useGetPublishedAssetsQuery,
  useGetPublishedAssetByIdQuery,
  useGetAssetDownloadUrlQuery,
  useCreateAssetPaymentOrderMutation,
  usePurchaseAssetMutation,
} = assetsApi;
