import { apiSlice } from "@/api/apiSlice";

export const carwashApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findCustomer: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/customer/find",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    createCutomer: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/customer/new",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useCreateCutomerMutation, useFindCustomerMutation } =
  carwashApiSlice;
