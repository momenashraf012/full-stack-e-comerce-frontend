import { api } from '../../services/api';
import { Product } from '../../types';

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { category?: string; brand?: string; search?: string; limit?: number } | void>({
      query: (params) => ({
        url: '/products',
        params: params || {},
      }),
      transformResponse: (response: { data: any[] }) => {
        return response.data.map((item) => ({
          ...item,
          id: item._id, // Map backend _id to frontend id
          image: item.imageCover, // Map backend imageCover to frontend image
          category: typeof item.category === 'object' ? item.category.name : 'منتج', // Extract name if populated
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: { data: any }) => ({
        ...response.data,
        id: response.data._id,
        image: response.data.imageCover,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query<any[], void>({
      query: () => '/categories',
      transformResponse: (response: { data: any[] }) =>
        response.data.map((item) => ({
          ...item,
          id: item._id,
        })),
      providesTags: ['Category'],
    }),
    getBrands: builder.query<any[], void>({
      query: () => '/brands',
      transformResponse: (response: { data: any[] }) =>
        response.data.map((item) => ({
          ...item,
          id: item._id,
        })),
      providesTags: ['Brand'],
    }),
    getSubCategories: builder.query<any[], string | void>({
      query: (categoryId) => categoryId
        ? `/categories/${categoryId}/subcategories`
        : '/subcategories',
      transformResponse: (response: { data: any[] }) =>
        response.data.map((item) => ({
          ...item,
          id: item._id,
        })),
    }),
    getReviews: builder.query<any[], string>({
      query: (productId) => `/products/${productId}/reviews`,
      transformResponse: (response: { data: any[] }) =>
        response.data.map((item) => ({
          ...item,
          id: item._id,
        })),
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetSubCategoriesQuery,
  useGetReviewsQuery
} = productApi;
