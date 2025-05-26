<template>
  <div>
    <h1>구글 로그인 처리 중...</h1>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export default {
  computed: {
    code() {
      return this.$route.query.code
    }
  },
  async mounted() {
    const auth = useAuthStore()

    if (this.code) {
      try {
        delete axios.defaults.headers.common.Authorization  // ✅ 소셜 로그인용 헤더 제거

        const res = await axios.post(
          'http://localhost:8000/api/auth/google/callback/',  // ✅ 수정됨: 기존 /accounts/... → /api/auth/...
          {
            code: this.code
          }
        )

        auth.accessToken = res.data.access
        auth.refreshToken = res.data.refresh
        await auth.fetchProfile()

        this.$router.push('/feed')
      } catch (err) {
        console.error('구글 로그인 실패', err)
      }
    }
  }
}
</script>
