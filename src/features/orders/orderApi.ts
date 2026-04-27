import { api } from '../../services/api';
import { Order } from '../../types';

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCashOrder: builder.mutation<any, { shippingAddress: any }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    createVodafoneCashOrder: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/orders/vodafoneCash',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getMyOrders: builder.query<{ data: Order[] }, void>({
      query: () => '/orders/myorders',
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateCashOrderMutation,
  useCreateVodafoneCashOrderMutation,
  useGetMyOrdersQuery,
} = orderApi;
