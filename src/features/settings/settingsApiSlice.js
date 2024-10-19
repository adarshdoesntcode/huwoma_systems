import { apiSlice } from "@/api/apiSlice";

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
      invalidatesTags: ["VehicleType"],
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
      query: (id) => ({
        url: `/settings/carwash/servicetype/${id}`,
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
} = settingsApiSlice;
