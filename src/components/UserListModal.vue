<!-- src/components/UserListModal.vue -->
<template>
  <teleport to="body" v-if="show">
    <div class="overlay" @click.self="close">
      <div class="modal">
        <header class="modal-header">
          <h3 class="title">{{ title }}</h3>
          <button class="btn-close" @click="close">✕</button>
        </header>
        <div class="modal-body">
          <input
            v-model="filter"
            type="text"
            placeholder="검색"
            class="search-input"
          />
          <ul class="user-list" v-if="filteredList.length">
            <li v-for="user in filteredList" :key="user.id" class="user-item">
              <img :src="user.profile_image" class="avatar" />
              <div class="info">
                <router-link
                  :to="{ name: 'UserProfile', params: { idname: user.idname } }"
                  class="info"
                >
                  <div class="username">{{ user.username }}</div>
                  <div class="handle">@{{ user.idname }}</div>
                </router-link>
              </div>
                <button
                v-if="user.id !== authStore.user?.id"
                class="btn-follow"
                :class="{ following: followStore.followingIds.has(user.id) }"
                @click="toggle(user.id)"
                >
                {{ followStore.followingIds.has(user.id) ? '팔로잉' : '팔로우' }}
              </button>
            </li>
          </ul>
          <div class="empty-text" v-else>
            아무도 없습니다..
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFollowStore } from '@/stores/follow'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  show: Boolean,
  title: { type: String, default: '유저 리스트' },
  list: { type: Array, default: () => [] }
})
const emit = defineEmits(['close'])

const followStore = useFollowStore()
const authStore = useAuthStore()
const filter = ref('')

const filteredList = computed(() => {
  if (!filter.value.trim()) return props.list
  return props.list.filter(u =>
    u.username.includes(filter.value.trim()) ||
    u.idname?.includes(filter.value.trim()) // ✅ 핸들도 검색되게
  )
})

async function toggle(userId) {
  if (followStore.followingIds.has(userId)) {
    await followStore.unfollow(userId)
  } else {
    await followStore.follow(userId)
  }
}


function close() {
  emit('close')
}

watch(() => props.show, visible => {
  if (visible) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
    filter.value = ''
  }
})

function onKeydown(e) {
  if (e.key === 'Escape') {
    close()
  }
}
</script>


<style scoped>
/* Dark semi-transparent overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

/* Modal container */
.modal {
  background: #1f1f1f;
  width: 100%;
  max-width: 360px;
  max-height: 80vh;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #eee;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #2a2a2a;
  border-bottom: 1px solid #333;
}
.title {
  margin: 0;
  font-size: 1rem;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #ccc;
  cursor: pointer;
}

/* Body */
.modal-body {
  padding: 0.5rem 1rem;
  overflow-y: auto;
  flex: 1;
}

/* Search input */
.search-input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #eee;
}
.search-input::placeholder {
  color: #888;
}

/* User list */
.user-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
  background: #444;
}
.info {
  flex: 1;
}
.username {
  font-size: 0.95rem;
  color: #eee;
}

/* Follow button */
.btn-follow {
  padding: 0.4rem 0.75rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #2a2a2a;
  color: #eee;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-follow.following {
  background: #444;
  border-color: #666;
}

/* Empty text */
.empty-text {
  text-align: center;
  color: #888;
  padding: 1rem 0;
}

/* Ensure custom scrollbar in dark mode */
.modal-body::-webkit-scrollbar {
  width: 6px;
}
.modal-body::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.modal-body::-webkit-scrollbar-track {
  background: #2a2a2a;
}
</style>
