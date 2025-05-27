<!-- src/components/MainMenuModal.vue -->
<template>
  <teleport to="body">
    <div class="overlay" @click.self="close">
      <div class="modal">
        <button class="option-btn" @click="logout">로그아웃</button>
        <button class="option-btn cancel" @click="close">취소</button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])
const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push({ name: 'Home' })
  emit('close')
}

function close() {
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal {
  width: 90%;
  max-width: 360px;
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
}
.option-btn {
  display: block;
  width: 100%;
  padding: 14px 0;
  border: none;
  background: none;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  color: #e2e2e2;
  transition: background 0.2s;
}
.modal .option-btn + .option-btn {
  border-top: 1px solid #333;
}
.option-btn:hover {
  background: #2b2b2b;
}
.option-btn.cancel {
  color: #ff6b6b;
  font-weight: bold;
}
</style>
