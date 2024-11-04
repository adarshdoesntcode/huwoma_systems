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
    transactionBooking: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/booking",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions"],
    }),
    transactionStartFromBooking: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/booking",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions"],
    }),
    getCarwashTransactions: builder.query({
      query: (credentials) => ({
        url: `/carwash/transactions/${credentials}`,
        method: "GET",
      }),
      providesTags: ["CarwashTransactions"],
    }),
    getCheckoutDetails: builder.query({
      query: (credentials) => ({
        url: `/carwash/checkoutdetails/${credentials.customerId}`,
        method: "GET",
      }),
    }),
    deleteCarwashTransaction: builder.mutation({
      query: (credentials) => ({
        url: `/carwash/transaction/${credentials.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CarwashTransactions"],
    }),
    getTransactionForInspection: builder.query({
      query: (credentials) => ({
        url: `/carwash/transaction/${credentials}`,
        method: "GET",
      }),
      providesTags: ["CarwashTransaction"],
    }),
    getPreFilterTransactions: builder.query({
      query: () => ({
        url: "/carwash/transaction/prefilter",
        method: "GET",
      }),
    }),
    getPostFilterTransactions: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/postfilter",
        method: "POST",
        body: { ...credentials },
      }),
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
  useGetTransactionForInspectionQuery,
  useDeleteCarwashTransactionMutation,
  useGetCheckoutDetailsQuery,
  useTransactionBookingMutation,
  useTransactionStartFromBookingMutation,
  useGetPreFilterTransactionsQuery,
  useGetPostFilterTransactionsMutation,
} = carwashApiSlice;
