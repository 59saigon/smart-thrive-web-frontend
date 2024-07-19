import { User } from "../../data/entities/user";

const api = 'https://stirring-terrier-moderately.ngrok-free.app/api';

export const ConstantsApi = {
  baseApi: api,
  getById: '/get-by-id',
  getByEmail: '/get-by-email',
  getAllPagination: '/get-all-pagination',
  getAllPaginationByListId: '/get-all-pagination-by-list-id',
  getAll: '/get-all',
  getAllSearch: '/search',
  add: '/add',
  update: '/update',
  delete: '/delete',
  user: {
    baseUrl: `${api}/user`,
    login: '/login',
    loginWithAnother: '/login-with-another',
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