const api = 'https://localhost:7999/api';

export const ConstantsApi = {
  baseApi: api,
  user: {
    baseUrl: `${api}/user`,
    getUser: '/get-user',
    getAllUser: '/get-all-user',
    getAllUserSearch: '/get-all-user-search',
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
    getPackage: '/get-package',
    getAllPackage: '/get-all-package',
    addPackage: '/add-new-package',
    updatePackage: '/update-package',
    deletePackage: '/delete-package',
  },
} 