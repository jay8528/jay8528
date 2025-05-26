<template>
  <div>
    <h1>네이버 로그인 처리 중...</h1>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export default {
  computed: {
    code() {
      return this.$route.query.code
    },
    state() {
      return this.$route.query.state
    }
  },
  async mounted() {
    const auth = useAuthStore()
    if (this.code) {
      try {
        delete axios.defaults.headers.common.Authorization
        const res = await axios.post('http://localhost:8000/api/auth/naver/callback/', {
          code: this.code,
          state: this.state
        })
        // ✅ 1. 토큰 값을 Pinia에 직접 반영
        auth.accessToken  = res.data.access
        auth.refreshToken = res.data.refresh

        // ✅ 2. 유저 프로필도 불러오기
        await auth.fetchProfile()

        // ✅ 3. 메인 피드로 이동
        this.$router.push('/feed')
      } catch (err) {
        console.error('네이버 로그인 실패', err)
      }
    }
  }
}
</script>
