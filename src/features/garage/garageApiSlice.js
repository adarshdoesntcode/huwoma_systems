import { apiSlice } from "@/api/apiSlice";

export const garageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicleConfig: builder.query({
      query: () => ({
        url: "/garage/vehicle-configs",
        method: "GET",
      }),
      providesTags: ["GarageVehicleConfigs"],
    }),
    searchCustomer: builder.mutation({
      query: (credentials) => ({
        url: "/garage/search-customer",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    newVehicleListing: builder.mutation({
      query: (credentials) => ({
        url: "/garage/vehicle-listing",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const {
  useGetVehicleConfigQuery,
  useSearchCustomerMutation,
  useNewVehicleListingMutation,
} = garageApiSlice;
