export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USER: {
    ME: '/users/me',
    CREATE: '/users/'
  },
  COMPANIES: {
    LIST: '/companies/',
    ME: '/companies/me',
    CREATE: '/companies/',
    UPDATE: (id) => `/companies/${id}`,
    DELETE: (id) => `/companies/${id}`
  },
  JOBS: {
    LIST: '/jobs/',
    CREATE: '/jobs/',
    UPDATE: (id) => `/jobs/${id}`,
    DELETE: (id) => `/jobs/${id}`,
    APPLICATIONS: (jobId) => `/jobs/${jobId}/applications`,
    APPLY: (jobId) => `/jobs/${jobId}/applications`
  },
  APPLICATIONS: {
    ME: '/applications/me',
    UPDATE_STATUS: (id) => `/applications/${id}/update-status`,
    DELETE: (id) => `/applications/${id}`
  }
};
