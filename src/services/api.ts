import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import CookieService from './cookies';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    prepareHeaders: (headers) => {
      // Get token from CookieService instead of localStorage
      const token = CookieService.get('jwt');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Brand', 'Review', 'Cart', 'Order', 'User', 'Wishlist'],
  endpoints: () => ({}),
});
