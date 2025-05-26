<!-- src/views/SignUpView.vue -->
<template>
  <div class="homeview">
    <div class="login-container">
      <SignUpForm />
    </div>
  </div>
</template>

<script setup>
import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import SignUpForm from '@/components/SignUpForm.vue'

const router = useRouter()
const authStore = useAuthStore()

watchEffect(() => {
  if (authStore.isAuthenticated) {
    router.replace({ name: 'MainFeed' })
  }
})
</script>

<style scoped>
.homeview {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
}
</style>