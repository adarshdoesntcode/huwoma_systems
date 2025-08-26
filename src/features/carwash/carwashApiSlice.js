import { apiSlice } from "@/api/apiSlice";

export const carwashApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findCustomer: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/customer/find",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getCarwashCustomers: builder.query({
      query: () => ({
        url: "/carwash/customers",
        method: "GET",
      }),
      providesTags: ["CarwashCustomers"],
    }),
    getCarwashCustomerById: builder.query({
      query: (id) => ({
        url: `/carwash/customer/${id}`,
        method: "GET",
      }),
      providesTags: ["CarwashCustomer"],
    }),
    updateCarwashCustomer: builder.mutation({
      query: (credentials) => ({
        url: `/carwash/customer/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashCustomer"],
    }),
    resetStreak: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/customer/resetstreak",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashCustomer"],
    }),
    editCustomerVehicle: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/customer/editvehicle",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashCustomer", "CarwashCustomers"],
    }),
    createCutomer: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/customer/new",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    vehicleTypeWithServices: builder.query({
      query: () => ({
        url: "/settings/carwash/vehicletype",
        method: "GET",
      }),
    }),
    transactionOne: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/1",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    transactionTwo: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/2",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    transactionThree: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/3",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    createOldRecord: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/old-record",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    transactionBooking: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/booking",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    transactionStartFromBooking: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/booking",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    getCarwashTransactions: builder.query({
      query: () => ({
        url: "/carwash/transactions",
        method: "GET",
      }),
      providesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    getCheckoutDetails: builder.query({
      query: (credentials) => ({
        url: `/carwash/checkoutdetails/${credentials.customerId}`,
        method: "GET",
      }),
    }),
    deleteCarwashTransaction: builder.mutation({
      query: (credentials) => ({
        url: `/carwash/transaction/${credentials.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "CarwashTransactions",
        "CarwashCustomer",
        "PostFilterTransactions",
        "CarwashCustomers",
      ],
    }),
    getTransactionForInspection: builder.query({
      query: (credentials) => ({
        url: `/carwash/transaction/${credentials}`,
        method: "GET",
      }),
      providesTags: ["CarwashTransaction"],
    }),
    getPreFilterTransactions: builder.query({
      query: () => ({
        url: "/carwash/transaction/prefilter",
        method: "GET",
      }),
    }),
    getPostFilterTransactions: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/postfilter",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    rollBackFromPickup: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/rollback/pickup",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: [
        "CarwashTransactions",
        "CarwashCustomer",
        "CarwashCustomers",
      ],
    }),
    rollBackFromCompleted: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/rollback/completed",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: [
        "CarwashTransactions",
        "CarwashCustomer",
        "CarwashCustomers",
      ],
    }),
    getPreEditData: builder.query({
      query: () => ({
        url: "/carwash/transaction/edit",
        method: "GET",
      }),
    }),
    editCarwashTransaction: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/edit",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: ["CarwashTransactions", "CarwashCustomers"],
    }),
    findCustomerByPhone: builder.mutation({
      query: ({ customerContact }) => ({
        url: `/carwash/customerbyphone/${customerContact}`,
        method: "GET",
      }),
    }),
    mergeSourcerAndTargetCustomer: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/customer/merge",
        method: "PUT",
        body: { ...credentials },
      }),
      invalidatesTags: [
        "CarwashTransactions",
        "CarwashCustomers",
        "CarwashCustomer",
      ],
    }),
    transferCarwashTransaction: builder.mutation({
      query: (credentials) => ({
        url: "/carwash/transaction/transfer",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: [
        "CarwashTransactions",
        "CarwashCustomers",
        "CarwashCustomer",
      ],
    }),
  }),
});

export const {
  useCreateCutomerMutation,
  useFindCustomerMutation,
  useVehicleTypeWithServicesQuery,
  useTransactionOneMutation,
  useTransactionTwoMutation,
  useTransactionThreeMutation,
  useGetCarwashTransactionsQuery,
  useGetTransactionForInspectionQuery,
  useDeleteCarwashTransactionMutation,
  useGetCheckoutDetailsQuery,
  useTransactionBookingMutation,
  useTransactionStartFromBookingMutation,
  useGetPreFilterTransactionsQuery,
  useGetPostFilterTransactionsMutation,
  useGetCarwashCustomersQuery,
  useGetCarwashCustomerByIdQuery,
  useUpdateCarwashCustomerMutation,
  useRollBackFromPickupMutation,
  useRollBackFromCompletedMutation,
  useEditCarwashTransactionMutation,
  useGetPreEditDataQuery,
  useResetStreakMutation,
  useEditCustomerVehicleMutation,
  useCreateOldRecordMutation,
  useFindCustomerByPhoneMutation,
  useMergeSourcerAndTargetCustomerMutation,
  useTransferCarwashTransactionMutation,
} = carwashApiSlice;
