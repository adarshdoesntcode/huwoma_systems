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
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["InspectionTemplate"],
    }),
  }),
});

export const {
  useCarwashconfigQuery,
  useCarwashInspectionTemplateQuery,
  useUpdateInspectionTemplateMutation,
  useDeleteCarWashConfigMutation,
  useCreateVehicleTypeMutation,
  useCreateServiceTypeMutation,
} = settingsApiSlice;
