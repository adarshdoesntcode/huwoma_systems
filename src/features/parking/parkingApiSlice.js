import { apiSlice } from "@/api/apiSlice";

export const parkingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParkingTransactions: builder.query({
      query: () => ({
        url: "/parking/transactions",
        method: "GET",
      }),
      providesTags: ["SimRacingTransactions"],
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
      invalidatesTags: ["SimRacingTransactions"],
    }),
    getParkingCheckoutDetails: builder.query({
      query: (credentials) => ({
        url: `/parking/checkoutdetails/${credentials}`,
        method: "GET",
      }),
    }),
    parkingCheckout: builder.mutation({
      query: (credentials) => ({
        url: "/parking/transaction/checkout",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["SimRacingTransactions"],
    }),
    cancelParking: builder.mutation({
      query: (credentials) => ({
        url: `/parking/transaction/${credentials}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SimRacingTransactions"],
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
} = parkingApiSlice;
