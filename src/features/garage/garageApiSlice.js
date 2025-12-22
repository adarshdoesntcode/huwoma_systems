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
    getBuyersIntrests: builder.query({
      query: (credentials) => ({
        url: "/garage/buyers-interests",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    checkoutVehicle: builder.mutation({
      query: (credentials) => ({
        url: "/garage/checkout-vehicle",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: [
        "GarageVehicleGarageStats",
        "GarageVehicleListings",
        "GarageVehicleDetails",
      ],
    }),
    getGarageFilteredTransactions: builder.mutation({
      query: (credentials) => ({
        url: "/garage/filteredtransactions",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    fulfillInterest: builder.mutation({
      query: (credentials) => ({
        url: `/garage/fulfill-interest/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["GarageBuyerInterests", "GarageInterestDetails"],
    }),
    getPublicVehicleDetails: builder.query({
      query: (credentials) => ({
        url: `/garage/vehicle-details/${credentials}`,
        method: "GET",
      }),
    }),
    getPublicVehicleListings: builder.query({
      query: (credentials) => ({
        url: "/garage/public-vehicle-listings",
        method: "POST",
        body: { ...credentials },
      }),
      providesTags: ["PublicVehicleListings"],
    }),
    // Public endpoints (no auth required)
    getPublicVehicleConfig: builder.query({
      query: () => ({
        url: "/garage/public-vehicle-config",
        method: "GET",
      }),
      providesTags: ["PublicVehicleConfigs"],
    }),
    publicNewVehicleListing: builder.mutation({
      query: (credentials) => ({
        url: "/garage/public-create-vehicle-listing",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["PublicVehicleListings"],
    }),
    getUnverifiedVehicleCount: builder.query({
      query: () => ({
        url: "/garage/unverified-count",
        method: "GET",
      }),
      providesTags: ["UnverifiedVehicleCount"],
    }),
    verifyVehicle: builder.mutation({
      query: ({ id, action }) => ({
        url: `/garage/verify-vehicle/${id}`,
        method: "PUT",
        body: { action },
      }),
      invalidatesTags: ["GarageVehicleListings", "UnverifiedVehicleCount"],
    }),
    publicNewBuyerInterest: builder.mutation({
      query: (credentials) => ({
        url: "/garage/public-create-buyer-interest",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getUnverifiedInterestCount: builder.query({
      query: () => ({
        url: "/garage/unverified-interest-count",
        method: "GET",
      }),
      providesTags: ["UnverifiedInterestCount"],
    }),
    verifyBuyerInterest: builder.mutation({
      query: ({ id, action }) => ({
        url: `/garage/verify-interest/${id}`,
        method: "PUT",
        body: { action },
      }),
      invalidatesTags: ["GarageBuyerInterests", "UnverifiedInterestCount"],
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
  useGetBuyersIntrestsQuery,
  useCheckoutVehicleMutation,
  useGetGarageFilteredTransactionsMutation,
  useFulfillInterestMutation,
  useGetPublicVehicleDetailsQuery,
  useGetPublicVehicleListingsQuery,
  useGetPublicVehicleConfigQuery,
  usePublicNewVehicleListingMutation,
  useGetUnverifiedVehicleCountQuery,
  useVerifyVehicleMutation,
  usePublicNewBuyerInterestMutation,
  useGetUnverifiedInterestCountQuery,
  useVerifyBuyerInterestMutation,
} = garageApiSlice;





