import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh or errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = data.data;

          localStorage.setItem('token', access_token);
          if (refresh_token) {
            localStorage.setItem('refreshToken', refresh_token);
          }

          api.defaults.headers.Authorization = `Bearer ${access_token}`;
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const getProfile = () => api.get('/users/me');
export const deleteProfile = () => api.delete('/users/me');

export const getCompanies = () => api.get('/companies/');
export const createCompany = (companyData) => api.post('/companies/', companyData);
export const getOwnCompany = () => api.get('/companies/me');
export const updateCompany = (id, companyData) => api.put(`/companies/${id}`, companyData);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);

export const createJob = (jobData) => api.post('/jobs/', jobData);
export const getJobs = (params) => api.get('/jobs/', { params });
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getJobApplications = (jobId) => api.get(`/jobs/${jobId}/applications`);
export const updateApplicationStatus = (applicationId, status) => api.put(`/applications/${applicationId}/update-status`, { application_status: status });
export const applyToJob = (jobId, coverLetter) => api.post(`/jobs/${jobId}/applications`, { cover_letter: coverLetter });
export const getMyApplications = () => api.get('/applications/me');
export const deleteApplication = (id) => api.delete(`/applications/${id}`);


