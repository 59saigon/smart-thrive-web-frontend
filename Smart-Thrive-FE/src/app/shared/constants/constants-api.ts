const api = 'https://localhost:7999/api';

export const ConstantsApi = {
  baseApi: api,
  user: {
    baseUrl: `${api}/user`,
    getUser: '/get-user',
    getAllUser: '/get-all-user',
    getUserByEmail: '/get-by-email',
    login: '/login',
    register: '/register',
    forget: '/forget',
    addUser: '/add-new-user',
    updateUser: '/update-user',
    deleteUser: '/delete-user',
  },
  course: {
    baseUrl: `${api}/course`,
    getCourses: '/get-courses',
    getCourseById: '/get-by-id',
  },
  package: {
    baseUrl: `${api}/package`,
    getPackages: '/get-packages',
    getPackageById: '/get-by-id',
  },
} 