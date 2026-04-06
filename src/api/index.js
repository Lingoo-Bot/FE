import axios from 'axios'

const crudApi = axios.create({
  baseURL: 'http://localhost:9002',
  headers: { 'Content-Type': 'application/json' },
})

const converseApi = axios.create({
  baseURL: 'http://localhost:9001',
  headers: { 'Content-Type': 'application/json' },
})

// 요청마다 토큰 자동 첨부
const withAuth = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return instance
}

withAuth(crudApi)
withAuth(converseApi)

// Auth
export const login = (username, password) =>
  crudApi.post('/api/user/login', { username, password })

export const signUp = (data) =>
  crudApi.post('/api/user/sign-up', data)

export const checkUsername = (username) =>
  crudApi.get(`/api/user/${username}`)

// Device (Pairing)
export const registerDevice = (deviceId, name) =>
  crudApi.post('/api/paring', { deviceId, name })

export const getDevice = () =>
  crudApi.get('/api/paring')

// Records
export const getRecords = () =>
  crudApi.get('/api/records/records')

export const getRecordDetail = (recordId) =>
  crudApi.get(`/api/records/records/${recordId}`)

export const deleteRecord = (recordId) =>
  crudApi.delete(`/api/records/records/${recordId}`)

// Statistics
export const getStatistics = (yearMonth) =>
  crudApi.get(`/api/statistics/${yearMonth}`)

// Session (Converse)
export const createSession = () =>
  converseApi.get('/api/session')
