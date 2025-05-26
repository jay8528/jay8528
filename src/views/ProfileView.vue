<template>
  <div class="profile-view">
    <h2>내 프로필</h2>

    <!-- 프로필 이미지 -->
    <div class="profile-img-rounded" v-if="authStore.user.profile_image">
      <img
        :src="authStore.user.profile_image"
        alt="Profile Image"
      />
    </div>

    <p><strong>Username:</strong> {{ authStore.user.username }}</p>
    <p><strong>Email:</strong> {{ authStore.user.email }}</p>

    <!-- 내 프로필이므로 항상 노출될 회원 수정/탈퇴 버튼 -->
    <div class="profile-actions">
      <button @click="goToEdit" class="btn-edit">회원 수정</button>
      <button @click="onDeleteAccount" class="btn-delete">회원 탈퇴</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios.js'

const authStore = useAuthStore()
const router = useRouter()

// 회원 수정 페이지로 이동 (예: /profile/edit)
function goToEdit() {
  router.push({ name: 'EditProfile' })
}

// 회원 탈퇴
async function onDeleteAccount() {
  if (!confirm('정말 회원 탈퇴하시겠습니까?')) return
  try {
    // 내 프로필 삭제(탈퇴) API 호출: DELETE /api/auth/profile/
    await axios.delete('/api/auth/profile/')
    authStore.logout()
    router.push({ name: 'Home' })
  } catch (err) {
    console.error('회원 탈퇴 실패', err)
    alert('회원 탈퇴에 실패했습니다.')
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #4caf50;
  color: #fff;
}

.btn-delete {
  background-color: #f44336;
  color: #fff;
}
</style>
