<template>
  <div class="user-profile-view">
    <h2>유저 프로필</h2>

    <!-- 프로필 이미지 -->
    <div class="profile-img-rounded" v-if="user.profile_image">
      <img :src="user.profile_image" alt="Profile Image" />
    </div>

    <p><strong>Username:</strong> {{ user.username }}</p>
    <p class="handle">@{{ user.idname }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>

    <!-- 팔로우/언팔로우 버튼 (내 프로필이 아닐 때) -->
    <button
      v-if="!isOwnProfile"
      @click="handleToggleFollow()"
      class="btn-follow-toggle"
      :class="isFollowing ? 'following' : 'not-following'"
    >
      {{ isFollowing ? '언팔로우' : '팔로우' }}
    </button>

    <!-- 팔로워/팔로잉 숫자 -->
    <div class="follow-stats">
      <span @click="openList('followers')" class="stat">
        팔로워 {{ user.follower_count }}
      </span>
      <span @click="openList('following')" class="stat">
        팔로잉 {{ user.following_count }}
      </span>
    </div>

    <!-- 내 프로필인 경우 회원 수정/탈퇴 버튼 -->
    <div v-if="isOwnProfile" class="profile-actions">
      <button @click="showEditModal = true" class="btn-edit">회원 수정</button>
      <button @click="onDeleteAccount" class="btn-delete">회원 탈퇴</button>
    </div>

    <!-- EditProfileModal -->
    <EditProfileModal
      v-if="showEditModal"
      @close="showEditModal = false"
      @updated="handleUpdated"
    />

    <!-- 팔로워/팔로잉 리스트 모달 -->
    <UserListModal
      :show="modal.show"
      :title="modal.title"
      :list="modal.list"
      @close="modal.show = false"
    >
      <template #empty>
        <div class="empty-text">아무도 없습니다..</div>
      </template>
    </UserListModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useFollowStore } from '@/stores/follow.js'
import axios from '@/plugins/axios.js'
import EditProfileModal from '@/components/EditProfileModal.vue'
import UserListModal from '@/components/UserListModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const followStore = useFollowStore()
const userId = route.params.idname

const user = ref({ id: null, username: '', idname: '', email: '', profile_image: '', follower_count: 0, following_count: 0 })
const showEditModal = ref(false)

// 모달 상태
const modal = reactive({ show: false, title: '', list: [] })

// 내 프로필 여부
const isOwnProfile = computed(() => authStore.user?.idname === userId)
// 내 팔로잉 상태
const isFollowing = computed(() => followStore.followingIds.has(user.value.id))


// 사용자 정보 로드
async function fetchUser() {
  try {
    const { data } = await axios.get(`/api/auth/users/by-idname/${userId}/`)
    user.value = data
  } catch (err) {
    console.error('유저 프로필 로드 실패', err)
  }
}

// 팔로우 상태 캐시
async function initFollowingIds() {
  if (authStore.user) await followStore.loadFollowingIds()
}

// 팔로우 토글
async function handleToggleFollow() {
  if (!user.value.id) return
  const targetId = user.value.id
  if (followStore.followingIds.has(targetId)) {
    await followStore.unfollow(targetId)
  } else {
    await followStore.follow(targetId)
  }
  await followStore.loadFollowingIds()
  await fetchUser()
}


// 팔로우/팔로잉 리스트 오픈
async function openList(type) {
  const url = `/api/auth/users/${user.value.id}/${type}/`
  const { data } = await axios.get(url)
  modal.list = data
  modal.title = type === 'followers' ? '팔로워' : '팔로잉'
  modal.show = true
}

// 회원 탈퇴
async function onDeleteAccount() {
  if (!confirm('정말 회원 탈퇴하시겠습니까?')) return
  try {
    await axios.delete('/api/auth/profile/')
    authStore.logout()
    router.push({ name: 'Home' })
  } catch (err) {
    console.error('회원 탈퇴 실패', err)
    alert('회원 탈퇴에 실패했습니다.')
  }
}

function handleUpdated() {
  showEditModal.value = false
  fetchUser()
}

// 초기 로드
onMounted(async () => {
  await initFollowingIds()
  await fetchUser()
})
</script>

<style scoped>
.user-profile-view {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-img-rounded {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  background-color: #f5f5f5;
}
.profile-img-rounded img {
  width: 100%; height: 100%; object-fit: cover;
}

.btn-follow-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
.btn-follow-toggle.not-following {
  background-color: #007bff;
  color: white;
}
.btn-follow-toggle.following {
  background-color: #e2e2e2;
  color: #333;
}

.follow-stats {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}
.stat {
  cursor: pointer;
  font-weight: bold;
}

.profile-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}
.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-edit { background-color: #4caf50; color: #fff; }
.btn-delete { background-color: #f44336; color: #fff; }

.empty-text {
  text-align: center;
  color: #888;
  padding: 1rem;
}
</style>