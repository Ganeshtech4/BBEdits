import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoursesAnalytics: builder.query({
            query: ({ startDate, endDate, groupBy }: { startDate?: string; endDate?: string; groupBy?: string } = {}) => {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                if (groupBy) params.append('groupBy', groupBy);
                
                return {
                    url: `get-courses-analytics${params.toString() ? '?' + params.toString() : ''}`,
                    method: 'GET',
                    credentials: 'include' as const,
                };
            },
        }),
        getUsersAnalytics: builder.query({
            query: ({ startDate, endDate, groupBy }: { startDate?: string; endDate?: string; groupBy?: string } = {}) => {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                if (groupBy) params.append('groupBy', groupBy);
                
                return {
                    url: `get-users-analytics${params.toString() ? '?' + params.toString() : ''}`,
                    method: 'GET',
                    credentials: 'include' as const,
                };
            }
        }),
        getOrdersAnalytics: builder.query({
            query: ({ startDate, endDate, groupBy }: { startDate?: string; endDate?: string; groupBy?: string } = {}) => {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                if (groupBy) params.append('groupBy', groupBy);
                
                return {
                    url: `get-orders-analytics${params.toString() ? '?' + params.toString() : ''}`,
                    method: 'GET',
                    credentials: 'include' as const,
                };
            }
        }),
    }),
});

export const { useGetCoursesAnalyticsQuery,useGetUsersAnalyticsQuery,useGetOrdersAnalyticsQuery } = analyticsApi;