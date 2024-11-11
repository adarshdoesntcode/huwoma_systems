import { apiSlice } from "@/api/apiSlice";

export const simRacingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findRacer: builder.mutation({
      query: (credentials) => ({
        url: "/simracing/customer/find",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    createRacer: builder.mutation({
      query: (credentials) => ({
        url: "/simracing/customer/new",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getSimRacingTransactions: builder.query({
      query: () => ({
        url: "/simracing/transactions",
        method: "GET",
      }),
      providesTags: ["SimRacingTransactions"],
    }),
    startRace: builder.mutation({
      query: (credentials) => ({
        url: "/simracing/transaction/start",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getAvailableRigs: builder.query({
      query: () => ({
        url: "/simracing/rigs",
        method: "GET",
      }),
    }),
    simracingBooking: builder.mutation({
      query: (credentials) => ({
        url: "/simracing/transaction/booking",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["SimRacingTransactions"],
    }),
    raceStartFromBooking: builder.mutation({
      query: (credentials) => ({
        url: "/simracing/transaction/booking",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["SimRacingTransactions"],
    }),
    getSimracingCheckoutDetails: builder.query({
      query: (credentials) => ({
        url: `/simracing/checkoutdetails/${credentials}`,
        method: "GET",
      }),
    }),
    simracingCheckout: builder.mutation({
      query: (credentials) => ({
        url: "/simracing/transaction/checkout",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions"],
    }),
    cancelRace: builder.mutation({
      query: (credentials) => ({
        url: `/simracing/transaction/${credentials.id}`,
        method: "PUT",
      }),
      invalidatesTags: ["SimRacingTransactions"],
    }),
    deleteSimracingTransaction: builder.mutation({
      query: (credentials) => ({
        url: `/simracing/transaction/${credentials.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SimRacingTransactions"],
    }),
  }),
});

export const {
  useGetSimRacingTransactionsQuery,
  useFindRacerMutation,
  useCreateRacerMutation,
  useGetAvailableRigsQuery,
  useStartRaceMutation,
  useDeleteSimracingTransactionMutation,
  useSimracingBookingMutation,
  useCancelRaceMutation,
  useRaceStartFromBookingMutation,
  useGetSimracingCheckoutDetailsQuery,
  useSimracingCheckoutMutation,
} = simRacingApiSlice;
