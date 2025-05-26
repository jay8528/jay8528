<!-- src/views/HomeView.vue -->
<template>
  <div class="homeview">
    <!-- 절대 위치로 딱 가운데 고정될 래퍼 -->
    <div class="login-container">
      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import { watchEffect }  from 'vue'
import { useRouter }    from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import LoginForm        from '@/components/LoginForm.vue'

const router    = useRouter()
const authStore = useAuthStore()

watchEffect(() => {
  if (authStore.isAuthenticated) {
    router.replace({ name: 'MainFeed' })
  }
})
</script>

<style scoped>
.homeview {
  position: relative;  /* 자식 .login-container 의 기준 */
  height: 100vh;       /* 화면 전체 높이 */
  overflow: hidden;
}

.login-container {
  /* 화면(조상) 기준으로 정확히 50% 지점 */
  position: absolute;
  top: 50%;
  left: 50%;
  /* 자신의 절반만큼 당겨서 완전 중앙 */
  transform: translate(-50%, -50%);

  /* 필요하다면 배경·패딩·모서리 둥글게 */

  padding: 2rem;
  border-radius: 1rem;

  /* 로그인 폼 최대 너비 */
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
}
</style>
