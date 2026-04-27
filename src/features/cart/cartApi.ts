import { api } from '../../services/api';
import { Cart } from '../../types';

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<{ data: Cart; numOfCartItems: number }, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<any, { productId: string; color?: string }>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateQuantity: builder.mutation<any, { itemId: string; quantity: number }>({
      query: ({ itemId, quantity }) => ({
        url: `/cart/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeItem: builder.mutation<any, string>({
      query: (itemId) => ({
        url: `/cart/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCartApi: builder.mutation<void, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useClearCartApiMutation,
} = cartApi;
