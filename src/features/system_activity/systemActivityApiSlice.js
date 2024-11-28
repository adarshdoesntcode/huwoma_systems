import { apiSlice } from "@/api/apiSlice";

export const systemActivity = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSystemActivity: builder.query({
      query: (credentials) => ({
        url: `/systemactivity/${credentials}`,
        method: "GET",
      }),
      providesTags: ["SystemActivity"],
    }),
  }),
});

export const { useGetSystemActivityQuery } = systemActivity;
