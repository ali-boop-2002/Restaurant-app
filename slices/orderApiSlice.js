import { apiSlice } from "./apiSlice";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_CREATE_ORDER}`,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: `${process.env.NEXT_PUBLIC_CREATE_ORDER}`,
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Order"],
    }),
    getAllOrders: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_GET_ALL_ORDERS}`,
      method: "GET",
      providesTags: ["Order"],
    }),
    providesTags: ["Order"],
    getOrderById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_GET_ORDER_BY_ID}/${id}`,
      method: "GET",
      providesTags: ["Order"],
    }),
    updateOrderById: builder.mutation({
      query: ({ id, data }) => ({
        url: `${process.env.NEXT_PUBLIC_UPDATE_ORDER_BY_ID}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useUpdateOrderByIdMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
} = orderApiSlice;
