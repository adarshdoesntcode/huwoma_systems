import { apiSlice } from "@/api/apiSlice";

export const garageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicleGarageStats: builder.query({
      query: () => ({
        url: "/garage/stats",
        method: "GET",
      }),
      providesTags: ["GarageVehicleGarageStats"],
    }),
    getVehicleListings: builder.query({
      query: (credentials) => ({
        url: "/garage/get-vehicle-listing",
        method: "POST",
        body: { ...credentials },
      }),
      providesTags: ["GarageVehicleListings"],
    }),
    editVehicleListings: builder.mutation({
      query: (credentials) => ({
        url: `/garage/vehicle-listing/${credentials._id}`,
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["GarageVehicleListings", "GarageVehicleDetails"],
    }),
    deleteVehicleListings: builder.mutation({
      query: (credentials) => ({
        url: `/garage/vehicle-listing/${credentials.id}`,
        method: "DELETE",
        body: { ...credentials },
      }),
      invalidatesTags: ["GarageVehicleListings", "GarageVehicleDetails"],
    }),
    getVehicleConfig: builder.query({
      query: () => ({
        url: "/garage/vehicle-configs",
        method: "GET",
      }),
      providesTags: ["GarageVehicleConfigs"],
    }),
    getVehicleDetails: builder.query({
      query: (credentials) => ({
        url: `/garage/vehicle/${credentials}`,
        method: "GET",
      }),
      providesTags: ["GarageVehicleDetails"],
    }),
    getInterestDetails: builder.query({
      query: (credentials) => ({
        url: `/garage/interest/${credentials}`,
        method: "GET",
      }),
      providesTags: ["GarageInterestDetails"],
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
        url: "/garage/create-vehicle-listing",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["GarageVehicleListings", "GarageVehicleGarageStats"],
    }),
    getBuyerInterests: builder.query({
      query: (credentials) => ({
        url: "/garage/get-buyer-interest",
        method: "POST",
        body: { ...credentials },
      }),
      providesTags: ["GarageBuyerInterests"],
    }),
    createBuyerInterest: builder.mutation({
      query: (credentials) => ({
        url: "/garage/create-buyer-interest",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["GarageBuyerInterests"],
    }),
    getPotentialMatches: builder.query({
      query: () => ({
        url: "/garage/potential-matches",
        method: "GET",
      }),
    }),
    deleteBuyerInterest: builder.mutation({
      query: (credentials) => ({
        url: `/garage/buyer-interest/${credentials.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GarageBuyerInterests"],
    }),
    editBuyerInterest: builder.mutation({
      query: (credentials) => ({
        url: `/garage/buyer-interest/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["GarageBuyerInterests", "GarageInterestDetails"],
    }),
    getPotentialBuyers: builder.query({
      query: (credentials) => ({
        url: `/garage/potential-buyers/${credentials.vehicleId}`,
        method: "GET",
      }),
    }),
    getPotentialVehicles: builder.query({
      query: (credentials) => ({
        url: `/garage/potential-vehicles/${credentials.interestId}`,
        method: "GET",
      }),
    }),
    getGarageCustomers: builder.query({
      query: () => ({
        url: "/garage/customers",
        method: "GET",
      }),
    }),
    getGarageCustomerDetails: builder.query({
      query: (credentials) => ({
        url: `/garage/customer/${credentials}`,
        method: "GET",
      }),
      providesTags: ["GarageCustomerDetails"],
    }),
    editGarageCustomer: builder.mutation({
      query: (credentials) => ({
        url: `/garage/customer/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["GarageCustomerDetails"],
    }),
  }),
});

export const {
  useGetVehicleGarageStatsQuery,
  useGetVehicleListingsQuery,
  useGetVehicleConfigQuery,
  useGetVehicleDetailsQuery,
  useSearchCustomerMutation,
  useNewVehicleListingMutation,
  useGetBuyerInterestsQuery,
  useGetInterestDetailsQuery,
  useEditVehicleListingsMutation,
  useGetPotentialMatchesQuery,
  useDeleteVehicleListingsMutation,
  useCreateBuyerInterestMutation,
  useDeleteBuyerInterestMutation,
  useEditBuyerInterestMutation,
  useGetPotentialBuyersQuery,
  useGetPotentialVehiclesQuery,
  useGetGarageCustomersQuery,
  useGetGarageCustomerDetailsQuery,
  useEditGarageCustomerMutation,
} = garageApiSlice;
