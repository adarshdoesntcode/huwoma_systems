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
    vehicleTypeWithServices: builder.query({
      query: () => ({
        url: "/settings/carwash/vehicletype",
        method: "GET",
      }),
    }),
    transactionOne: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/1",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions"],
    }),
    transactionTwo: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/2",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions"],
    }),
    transactionThree: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/3",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions"],
    }),
    getCarwashTransactions: builder.query({
      query: (credentials) => ({
        url: `/carwash/transactions?date=${credentials}`,
        method: "GET",
      }),
      providesTags: ["CarwashTransactions"],
    }),
  }),
});

export const {
  useCreateCutomerMutation,
  useFindCustomerMutation,
  useVehicleTypeWithServicesQuery,
  useTransactionOneMutation,
  useTransactionTwoMutation,
  useTransactionThreeMutation,
  useGetCarwashTransactionsQuery,
} = carwashApiSlice;
