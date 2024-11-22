import { apiSlice } from "@/api/apiSlice";
import { create } from "lodash";

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    carwashconfig: builder.query({
      query: () => ({
        url: "/settings/carwash/vehicletype",
        method: "GET",
      }),
      providesTags: ["VehicleTypes"],
    }),

    vehicleTypebyId: builder.query({
      query: (id) => ({
        url: `/settings/carwash/vehicletype/${id}`,
        method: "GET",
      }),
      providesTags: ["VehicleType"],
    }),

    updateVehicleType: builder.mutation({
      query: (credentials) => ({
        url: "/settings/carwash/vehicletype",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["VehicleType", "VehicleTypes"],
    }),

    createVehicleType: builder.mutation({
      query: (credentials) => ({
        url: "/settings/carwash/vehicletype",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["VehicleTypes"],
    }),

    createServiceType: builder.mutation({
      query: (credentials) => ({
        url: "/settings/carwash/servicetype",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["VehicleTypes"],
    }),

    serviceType: builder.query({
      query: (vehicleTypeId) => ({
        url: `/settings/carwash/servicetype/${vehicleTypeId}`,
        method: "GET",
      }),
      providesTags: ["ServiceType"],
    }),

    updateServiceType: builder.mutation({
      query: (credentials) => ({
        url: "/settings/carwash/servicetype",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["ServiceType"],
    }),

    deleteCarWashConfig: builder.mutation({
      query: (credentials) => ({
        url: "/settings/carwash/vehicletype",
        method: "DELETE",
        body: { ...credentials },
      }),
      invalidatesTags: ["VehicleTypes"],
    }),

    carwashInspectionTemplate: builder.query({
      query: () => ({
        url: "/settings/carwash/inspection",
        method: "GET",
      }),
      providesTags: ["InspectionTemplate"],
    }),

    updateInspectionTemplate: builder.mutation({
      query: (credentials) => ({
        url: "/settings/carwash/inspection",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["InspectionTemplate"],
    }),

    getPaymentMode: builder.query({
      query: () => ({
        url: "/settings/paymentmode",
        method: "GET",
      }),
      providesTags: ["PaymentModes"],
    }),

    createPaymentMode: builder.mutation({
      query: (credentials) => ({
        url: "/settings/paymentmode",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["PaymentModes"],
    }),

    deletePaymentMode: builder.mutation({
      query: (credentials) => ({
        url: "/settings/paymentmode",
        method: "DELETE",
        body: { ...credentials },
      }),
      invalidatesTags: ["PaymentModes"],
    }),

    updatePaymentMode: builder.mutation({
      query: (credentials) => ({
        url: "/settings/paymentmode",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["PaymentModes"],
    }),

    getParkingVehicles: builder.query({
      query: () => ({
        url: "/settings/parking",
        method: "GET",
      }),
      providesTags: ["ParkingVehicles"],
    }),

    createParkingVehicle: builder.mutation({
      query: (credentials) => ({
        url: "/settings/parking",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingVehicles"],
    }),

    deleteParkingVehicle: builder.mutation({
      query: (credentials) => ({
        url: "/settings/parking",
        method: "DELETE",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingVehicles"],
    }),

    updateParkingVehicle: builder.mutation({
      query: (credentials) => ({
        url: "/settings/parking",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["ParkingVehicles"],
    }),

    updateAdminProfile: builder.mutation({
      query: (credentials) => ({
        url: `/settings/general/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminProfile", id },
      ],
    }),
    getAllAdmins: builder.query({
      query: () => ({
        url: "/settings/admins",
        method: "GET",
      }),
      providesTags: ["Admins"],
    }),
    createAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/settings/admins",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/settings/admins",
        method: "DELETE",
        body: { ...credentials },
      }),
      invalidatesTags: ["Admins"],
    }),
    updateAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/settings/admins",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["Admins"],
    }),
    getSimRacingRigs: builder.query({
      query: () => ({
        url: "/settings/simracing",
        method: "GET",
      }),
      providesTags: ["SimRacingRigs"],
    }),
    createSimRacingRig: builder.mutation({
      query: (credentials) => ({
        url: "/settings/simracing",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["SimRacingRigs"],
    }),
    updateSimRacingRig: builder.mutation({
      query: (credentials) => ({
        url: "/settings/simracing",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["SimRacingRigs"],
    }),
    deleteSimRacingRig: builder.mutation({
      query: (credentials) => ({
        url: "/settings/simracing",
        method: "DELETE",
        body: { ...credentials },
      }),
      invalidatesTags: ["SimRacingRigs"],
    }),
    getSimRacingCoordinates: builder.query({
      query: () => ({
        url: "/settings/simracing/location",
        method: "GET",
      }),
      providesTags: ["SimRacingCoordinates"],
    }),
    updateSimRacingCoordinates: builder.mutation({
      query: (credentials) => ({
        url: "/settings/simracing/location",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["SimRacingCoordinates"],
    }),
    getPOSAccess: builder.query({
      query: () => ({
        url: "/settings/pos-access",
        method: "GET",
      }),
      providesTags: ["POSAccesses"],
    }),
    deletePOSAccess: builder.mutation({
      query: (credentials) => ({
        url: `/settings/pos-access/${credentials.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["POSAccesses"],
    }),
    createPOSAccess: builder.mutation({
      query: (credentials) => ({
        url: "/settings/pos-access",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["POSAccesses"],
    }),
  }),
});

export const {
  useCarwashconfigQuery,
  useVehicleTypebyIdQuery,
  useUpdateVehicleTypeMutation,
  useCarwashInspectionTemplateQuery,
  useUpdateInspectionTemplateMutation,
  useUpdateServiceTypeMutation,
  useDeleteCarWashConfigMutation,
  useCreateVehicleTypeMutation,
  useCreateServiceTypeMutation,
  useServiceTypeQuery,
  useGetPaymentModeQuery,
  useCreatePaymentModeMutation,
  useUpdatePaymentModeMutation,
  useDeletePaymentModeMutation,
  useUpdateAdminProfileMutation,
  useCreatePOSAccessMutation,
  useDeletePOSAccessMutation,
  useGetPOSAccessQuery,
  useGetSimRacingRigsQuery,
  useCreateSimRacingRigMutation,
  useUpdateSimRacingRigMutation,
  useDeleteSimRacingRigMutation,
  useGetSimRacingCoordinatesQuery,
  useUpdateSimRacingCoordinatesMutation,
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
  useGetParkingVehiclesQuery,
  useCreateParkingVehicleMutation,
  useDeleteParkingVehicleMutation,
  useUpdateParkingVehicleMutation,
} = settingsApiSlice;
