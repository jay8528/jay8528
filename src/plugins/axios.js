// src/plugins/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'

// 1) 베이스 URL
axios.defaults.baseURL = 'http://127.0.0.1:8000'

// 2) 요청 인터셉터 설정: 토큰이 있으면 모든 요청에 헤더 추가
axios.interceptors.request.use(config => {
  const authStore = useAuthStore()
  const token = authStore.accessToken   // Composition API 스토어의 토큰 참조
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default axios
