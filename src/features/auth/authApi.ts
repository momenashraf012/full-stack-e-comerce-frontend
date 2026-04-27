import { api } from '../../services/api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    getMe: builder.query<{ data: import('../../types').User }, void>({
      query: () => '/users/getMe',
      providesTags: ['User'],
    }),
    updateMe: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.email) formData.append('email', data.email);
        if (data.phone) formData.append('phone', data.phone);
        if (data.profileImg) formData.append('profileImg', data.profileImg);
        return {
          url: '/users/updateMe',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
    changeMyPassword: builder.mutation({
      query: (data) => ({
        url: '/users/changeMyPassword',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangeMyPasswordMutation,
} = authApi;
