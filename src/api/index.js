import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const login = (username, password) =>
  api.post('/api/user/login', { username, password })

export const signUp = (data) =>
  api.post('/api/user/sign-up', data)

export const checkUsername = (username) =>
  api.get(`/api/user/${username}`)

// Device (Pairing)
export const registerDevice = (deviceId, name) =>
  api.post('/api/paring', { deviceId, name })

export const getDevice = () =>
  api.get('/api/paring')

// Records
export const getRecords = () =>
  api.get('/api/records')

export const getRecordDetail = (recordId) =>
  api.get(`/api/records/${recordId}`)

export const deleteRecord = (recordId) =>
  api.delete(`/api/records/${recordId}`)

// Statistics
export const getStatistics = (yearMonth) =>
  api.get(`/api/statistics/${yearMonth}`)

export const getWeekly = () =>
  api.get(`/api/statistics/weekly`)

// Conversation
export const startConversation = () =>
  api.post('/api/conversation/start')

export const recordConversation = () =>
  api.post('/api/conversation/record')

export const stopConversation = () =>
  api.post('/api/conversation/stop')
