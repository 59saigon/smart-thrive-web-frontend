const api = 'https://localhost:7999/api';

export const ConstantsApi = {
  baseApi: api,
  user: {
    baseUrl: `${api}/user`,
    getUser: '/get-by-id',
    getAllUser: '/get-all-pagination',
    getAllUserSearch: '/search',
    getUserByEmail: '/get-by-email',
    login: '/login',
    register: '/register',
    forget: '/forget',
    addUser: '/add',
    updateUser: '/update',
    deleteUser: '/delete',
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