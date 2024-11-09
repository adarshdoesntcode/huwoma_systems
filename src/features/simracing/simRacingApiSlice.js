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
      query: (credentials) => ({
        url: `/simracing/transactions/${credentials}`,
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
  }),
});

export const {
  useGetSimRacingTransactionsQuery,
  useFindRacerMutation,
  useCreateRacerMutation,
  useGetAvailableRigsQuery,
  useStartRaceMutation,
} = simRacingApiSlice;
