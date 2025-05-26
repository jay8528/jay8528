// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, watch }   from 'vue'
import axios            from '@/plugins/axios.js'

export const useAuthStore = defineStore(
  'auth',
  () => {
    /* ─ state ─ */
    const user         = ref(null)
    const accessToken  = ref(null)
    const refreshToken = ref(null)

    /* ─ helpers ─ */
    function setAuthHeader (token) {
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
      } else {
        delete axios.defaults.headers.common.Authorization
      }
    }
    /* 새로고침 직후에도 헤더 반영 */
    setAuthHeader(accessToken.value)
    watch(accessToken, setAuthHeader)

    /* ─ actions ─ */
    async function login (cred) {
      const { data } = await axios.post('/api/auth/token/', cred)
      accessToken.value  = data.access
      refreshToken.value = data.refresh
      await fetchProfile()
    }

    async function register (payload) {
      const { data } = await axios.post('/api/auth/register/', payload)
      accessToken.value  = data.access
      refreshToken.value = data.refresh
      await fetchProfile()
    }

    async function fetchProfile () {
      try {
        const { data } = await axios.get('/api/auth/profile/')
        user.value = data
      } catch (err) { logout(); throw err }
    }

    function logout () {
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      delete axios.defaults.headers.common.Authorization
    }

    return {
      /* state */
      user,
      accessToken,
      refreshToken,

      /* getters */
      get isAuthenticated () { return !!accessToken.value },

      /* actions */
      login,
      register,
      fetchProfile,
      logout
    }
  },
  {
    /* ─ pinia-plugin-persistedstate 설정 ─ */
    persist: {
      key: 'auth',                       // localStorage 항목 이름
      paths: ['accessToken', 'refreshToken', 'user'],  // 저장할 속성
      storage: sessionStorage          // 세션 저장소를 쓰고 싶으면 주석 해제
    }
  }
)
