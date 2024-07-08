import { User } from "../../data/entities/user";

const api = 'https://localhost:7999/api';

export const ConstantsApi = {
  baseApi: api,
  getById: '/get-by-id',
  getAllPagination: '/get-all-pagination',
  getAllPaginationByListId: '/get-all-pagination-by-list-id',
  getAll: '/get-all',
  getAllSearch: '/search',
  add: '/add',
  update: '/update',
  delete: '/delete',
  user: {
    baseUrl: `${api}/user`,
    getUserByEmail: '/get-by-email',
    login: '/login',
    register: '/register',
    forget: '/forget',
  },
  course: {
    baseUrl: `${api}/course`,
  },
  package: {
    baseUrl: `${api}/package`,
  },

  
} 