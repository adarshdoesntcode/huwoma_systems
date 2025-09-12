import { apiSlice } from "@/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    refresh: builder.query({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
    refreshUser: builder.query({
      query: () => ({
        url: "/user/account",
        method: "GET",
      }),
    }),
    logout: builder.query({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
    getCheckoutEndpoint: builder.query({
      query: (credentials) => ({
        url: `/qr/checkoutendpoint/${credentials}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useDefenseLoginMutation,
  useGetCheckoutEndpointQuery,
} = authApiSlice;
