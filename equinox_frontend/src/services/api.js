import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'fin_token'
const USERNAME_KEY = import.meta.env.VITE_USERNAME_KEY || 'fin_username'
const ROLE_KEY = import.meta.env.VITE_ROLE_KEY || 'fin_role'

const api = axios.create({ 
  baseURL: BASE_URL,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
})

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem(TOKEN_KEY)
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(r => r, err => {
  if ([401, 403].includes(err.response?.status)) {
    [TOKEN_KEY, USERNAME_KEY, ROLE_KEY].forEach(k => localStorage.removeItem(k))
    window.location.href = '/login'
  }
  return Promise.reject(err)
})

export const authAPI = {
  login: d => api.post('/api/auth/login', d),
  register: d => api.post('/api/auth/register', d),
}

export const txAPI = {
  getAll: (page=0, size=10, filters={}) => {
    const params = new URLSearchParams({ page, size })
    if (filters.type) params.append('type', filters.type)
    if (filters.category) params.append('category', filters.category)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    return api.get(`/api/transactions?${params.toString()}`)
  },
  exportCSV: (filters={}) => {
    const params = new URLSearchParams()
    if (filters.type) params.append('type', filters.type)
    if (filters.category) params.append('category', filters.category)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    return api.get(`/api/transactions/export/csv?${params.toString()}`, { responseType: 'blob' })
  },
  create: d => api.post('/api/transactions', d),
  update: (id, d) => api.put(`/api/transactions/${id}`, d),
  remove: id => api.delete(`/api/transactions/${id}`),
  byType: t => api.get(`/api/transactions/filter/type?type=${t}`),
  byCategory: c => api.get(`/api/transactions/filter/category?category=${encodeURIComponent(c)}`),
  byDate: (s, e) => api.get(`/api/transactions/filter/date?start=${s}&end=${e}`),
}

export const budgetAPI = {
  getAll: () => api.get('/api/budgets'),
  getProgress: () => api.get('/api/budgets/progress'),
  upsert: d => api.post('/api/budgets', d),
  remove: id => api.delete(`/api/budgets/${id}`),
}

export const dashAPI = {
  summary: () => api.get('/api/dashboard/summary'),
  monthly: () => api.get('/api/dashboard/trends/monthly'),
  category: () => api.get('/api/dashboard/trends/category'),
}

export const usersAPI = {
  getAll: () => api.get('/api/users'),
  updateRole: (id, role) => api.put(`/api/users/${id}/role`, { role }),
  toggle: id => api.put(`/api/users/${id}/toggle-status`),
  remove: id => api.delete(`/api/users/${id}`),
}

export default api