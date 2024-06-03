const api = 'https://localhost:7192/api';

const API = {
  baseApi: api,
  user: {
    baseUrl: `${api}/user`,
    getUsers: '/get-users',
    getUserByEmail: '/get-by-email',
    login: '/login',
    register: '/register',
    forget: '/forget',
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


export enum AppConstants {
  BASE_URL = api,

  LOGIN = 'login',

  REGISTER = 'register',

  CREATE = 'create',

  UPDATE = 'update',

  DELETE = 'delete',

  GET_LIST = 'get',

  GET_BY = 'get-by',

  ENTITY_WEDDING = 'wedding',

  ENTITY_EVENT = 'event',

  ENTITY_SERVICE = 'service',

  ENTITY_LOCATION = 'location',

  ENTITY_PHOTO = 'photo',
}