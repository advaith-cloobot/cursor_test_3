import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Workspace API functions
export const workspaceAPI = {
  // Get all workspaces
  getAll: () => api.get('/workspaces'),
  
  // Get workspace by ID
  getById: (id) => api.get(`/workspaces/${id}`),
  
  // Create workspace
  create: (data) => api.post('/workspaces', data),
  
  // Update workspace
  update: (id, data) => api.put(`/workspaces/${id}`, data),
  
  // Delete workspace
  delete: (id) => api.delete(`/workspaces/${id}`),
  
  // Upload files to workspace
  uploadFiles: (id, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return api.post(`/workspaces/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get SOW data for workspace
  getSOW: (id) => api.get(`/workspaces/${id}/sow`),
};

// License API functions
export const licenseAPI = {
  // Get predefined Salesforce licenses
  getAll: () => api.get('/licenses'),
};

export default api;
