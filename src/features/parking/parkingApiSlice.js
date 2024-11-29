import { apiSlice } from "@/api/apiSlice";

export const parkingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParkingTransactions: builder.query({
      query: () => ({
        url: "/parking/transactions",
        method: "GET",
      }),
      providesTags: ["ParkingTransactions"],
    }),
    getParkingFilteredTransactions: builder.mutation({
      query: (credentials) => ({
        url: "/parking/filteredtransactions",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    startParking: builder.mutation({
      query: (credentials) => ({
        url: "/parking/start",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
    getParkingCheckoutDetails: builder.query({
      query: (credentials) => ({
        url: `/parking/checkoutdetails/${credentials}`,
        method: "GET",
      }),
    }),
    parkingRollbackFromCompleted: builder.mutation({
      query: (credentials) => ({
        url: "/parking/transaction/rollback",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
    parkingCheckout: builder.mutation({
      query: (credentials) => ({
        url: "/parking/transaction/checkout",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
    cancelParking: builder.mutation({
      query: (credentials) => ({
        url: `/parking/transaction/${credentials}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
  }),
});

export const {
  useGetParkingTransactionsQuery,
  useStartParkingMutation,
  useCancelParkingMutation,
  useGetParkingCheckoutDetailsQuery,
  useParkingCheckoutMutation,
  useGetParkingFilteredTransactionsMutation,
  useParkingRollbackFromCompletedMutation,
} = parkingApiSlice;
