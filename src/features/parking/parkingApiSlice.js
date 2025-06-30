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
    getParkingSettlementDetails: builder.query({
      query: (credentials) => ({
        url: `/parking/settlementdetails/${credentials}`,
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
    parkingSettlement: builder.mutation({
      query: (credentials) => ({
        url: "/parking/transaction/settlement",
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
    newParkingTab: builder.mutation({
      query: (credentials) => ({
        url: `/parking/create-parking-tab`,
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
    addToParkingTab: builder.mutation({
      query: (credentials) => ({
        url: "/parking/add-to-tab",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
    cancelParkingTab: builder.mutation({
      query: (credentials) => ({
        url: `/parking/tab/${credentials.tabId}/${credentials.transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
    finishParkingTab: builder.mutation({
      query: (credentials) => ({
        url: `/parking/finish-tab`,
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingTransactions"],
    }),
    terminateParkingTab: builder.mutation({
      query: (credentials) => ({
        url: `/parking/tab/${credentials.tabId}`,
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
  useNewParkingTabMutation,
  useAddToParkingTabMutation,
  useCancelParkingTabMutation,
  useFinishParkingTabMutation,
  useTerminateParkingTabMutation,
  useGetParkingSettlementDetailsQuery,
  useParkingSettlementMutation,
} = parkingApiSlice;
