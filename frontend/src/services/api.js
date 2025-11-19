import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.details || 'An error occurred'
      return Promise.reject(new Error(message))
    } else if (error.request) {
      return Promise.reject(new Error('No response from server'))
    } else {
      return Promise.reject(error)
    }
  }
)

export const calculateRoute = async (tripData) => {
  const response = await api.post('/api/calculate-route/', tripData)
  return response.data
}

export default api

