// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist   from 'pinia-plugin-persistedstate'
import App            from '@/App.vue'
import router         from '@/router'
import '@/assets/css/global.css'

// GSAP 및 ScrollTrigger 플러그인 등록
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import { useAuthStore } from '@/stores/auth'

async function bootstrap() {
  const app   = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)

  // 1) 서버 재시작 등으로 토큰 검증이 필요할 때
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    try {
      await authStore.fetchProfile()
    } catch (err) {
      // 검증 실패 시 강제 로그아웃
      authStore.logout()
    }
  }

  // 2) 그 다음에 라우터와 GSAP 등을 등록하고 마운트
  app.use(router)
  app.mount('#app')
}

bootstrap()
