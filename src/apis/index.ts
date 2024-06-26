import token from '@/stores/token'
import axios from 'axios'

const service = axios.create({
  baseURL: 'http://47.115.47.249:8000',
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    if (token.value) {
      config.headers['Authorization'] = token.value
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use((response) => {
  if (
    response.data.code === 200 ||
    response.data.success ||
    response.status === 200
  ) {
    if (!token.value) {
      token.value = response.headers['authorization']
    }
    return response
  }

  return Promise.reject(response)
})

export default service
