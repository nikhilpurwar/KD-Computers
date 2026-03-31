import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Students', 'Fees', 'Books', 'Shifts'],
  endpoints: (builder) => ({
    // Dashboard stats
    getStudents: builder.query({
      query: (params = {}) => ({ url: '/students', params }),
      providesTags: ['Students'],
    }),
    getFees: builder.query({
      query: (params = {}) => ({ url: '/fees', params }),
      providesTags: ['Fees'],
    }),
    getBooks: builder.query({
      query: (params = {}) => ({ url: '/books', params }),
      providesTags: ['Books'],
    }),
    getShifts: builder.query({
      query: () => '/shifts',
      providesTags: ['Shifts'],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useGetFeesQuery,
  useGetBooksQuery,
  useGetShiftsQuery,
} = apiSlice
