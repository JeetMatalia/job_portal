import axios from 'axios';
import { API_ENDPOINTS } from '../constant/apiEndpoints';

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
          const { data } = await axios.post(`${api.defaults.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
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

export const getProfile = () => api.get(API_ENDPOINTS.USER.ME);
export const deleteProfile = () => api.delete(API_ENDPOINTS.USER.ME);

export const getCompanies = () => api.get(API_ENDPOINTS.COMPANIES.LIST);
export const createCompany = (companyData) => api.post(API_ENDPOINTS.COMPANIES.CREATE, companyData);
export const getOwnCompany = () => api.get(API_ENDPOINTS.COMPANIES.ME);
export const updateCompany = (id, companyData) => api.put(API_ENDPOINTS.COMPANIES.UPDATE(id), companyData);
export const deleteCompany = (id) => api.delete(API_ENDPOINTS.COMPANIES.DELETE(id));

export const createJob = (jobData) => api.post(API_ENDPOINTS.JOBS.CREATE, jobData);
export const getJobs = (params) => api.get(API_ENDPOINTS.JOBS.LIST, { params });
export const updateJob = (id, jobData) => api.put(API_ENDPOINTS.JOBS.UPDATE(id), jobData);
export const deleteJob = (id) => api.delete(API_ENDPOINTS.JOBS.DELETE(id));
export const getJobApplications = (jobId) => api.get(API_ENDPOINTS.JOBS.APPLICATIONS(jobId));
export const updateApplicationStatus = (applicationId, status) => api.put(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId), { application_status: status });
export const applyToJob = (jobId, coverLetter) => api.post(API_ENDPOINTS.JOBS.APPLY(jobId), { cover_letter: coverLetter });
export const getMyApplications = () => api.get(API_ENDPOINTS.APPLICATIONS.ME);
export const deleteApplication = (id) => api.delete(API_ENDPOINTS.APPLICATIONS.DELETE(id));


