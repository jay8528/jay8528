<template>
  <div>
    <h1>OAuth Redirect</h1>
    <p>코드: {{ code }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export default {
  computed: {
    code() {
      return this.$route.query.code || '없음'
    }
  },
  async mounted() {
    const auth = useAuthStore()

    if (this.code && this.code !== '없음') {
      try {
        delete axios.defaults.headers.common.Authorization  // ✅ 인증 헤더 제거

        const res = await axios.post('http://localhost:8000/api/auth/kakao/callback/', {
          code: this.code
        })

        // ✅ 토큰 저장
        auth.accessToken = res.data.access
        auth.refreshToken = res.data.refresh

        // ✅ 사용자 정보 불러오기
        await auth.fetchProfile()

        // ✅ 메인 페이지로 이동
        this.$router.push('/feed')
      } catch (err) {
        console.error('카카오 로그인 실패', err)
      }
    }
  }
}
</script>

