<!-- src/components/PostCard.vue -->
<template>
  <div class="post-card">
    <!-- 내부 전체를 감싸는 wrapper -->
    <div class="card-inner">
      <!-- 헤더 -->
      <div class="post-header">
        <router-link
          v-if="localPost.author_idname"
          :to="{ name: 'UserProfile', params: { idname: localPost.author_idname } }"
          class="profile-link"
          @click.stop
        >
          <img
            :src="localPost.author_profile_image"
            alt="Author avatar"
            class="profile-avatar"
        />
          <div class="profile-text">
            <span class="profile-name">{{ localPost.author_username }}</span>
            <span class="handle">@{{ localPost.author_idname }}</span>
          </div>
        </router-link>
        <button class="btn-options" @click="showOptions = true">⋮</button>
      </div>

      <!-- 이미지 -->
      <div class="post-images-wrapper" @click="openDetail">
        <img :src="localPost.image1" alt="Image 1" class="post-image-half" />
        <img :src="localPost.image2" alt="Image 2" class="post-image-half" />
      </div>

      <!-- 책 링크 (ISBN이 있을 때만 보이게) -->
      <router-link
        v-if="localPost.book && localPost.book.isbn13"
        :to="{ 
          name: 'BookDetail', 
          params: { isbn: localPost.book.isbn13 } 
        }"
        class="book-link"
      >
        {{ localPost.book_title }} – {{ localPost.book_authors }}
      </router-link>


       <!-- 푸터 -->
      <div class="post-footer">
        <div class="post-text" @click="openDetail">{{ localPost.content }}</div>
        <div class="post-actions">
          <button @click="toggleLike">
            <span v-if="localPost.is_liked">❤️</span><span v-else>🤍</span>
          </button>
          <button @click="openDetail">💬</button>
          <button @click="sharePost">🔗</button>
        </div>
      </div>
    </div>


    <!-- 기존 옵션/편집/상세/복사 팝업 (로직 그대로) -->
    <PostOptionsPopup
      v-if="showOptions"
      :is-own-post="isOwnPost"
      :is-following="isFollowing"
      :user-id="localPost.author"
      @edit="onEdit"
      @delete="onDelete"
      @toggleFollow="onToggleFollow"
      @close="showOptions = false"
    />
    <EditPostModal
      v-if="editing"
      :post="localPost"
      @close="editing = false"
      @updated="refreshFeed"
    />
    <PostDetailModal
      v-if="showDetail"
      :postId="localPost.id"
      @close="showDetail = false"
    />
    <transition name="fade">
      <div v-if="showCopiedOverlay" class="copy-popup">
        링크가 복사되었습니다!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { usePostStore } from '@/stores/post.js'
import { useFollowStore } from '@/stores/follow.js'

import PostOptionsPopup from './PostOptionsPopup.vue'
import EditPostModal     from './EditPostModal.vue'
import PostDetailModal   from './PostDetailModal.vue'

const props       = defineProps({ post: { type: Object, required: true }})
const authStore   = useAuthStore()
const postStore   = usePostStore()
const followStore = useFollowStore()

const localPost         = reactive({ ...props.post })
const showOptions       = ref(false)
const editing           = ref(false)
const showDetail        = ref(false)
const showCopiedOverlay = ref(false)

const isOwnPost   = computed(() => authStore.user?.id === localPost.author)
const isFollowing = computed(() => followStore.followingIds.has(localPost.author))

async function toggleLike() {
  try {
    if (localPost.is_liked) {
      await postStore.unlikePost(localPost.id)
      localPost.is_liked = false
    } else {
      await postStore.likePost(localPost.id)
      localPost.is_liked = true
    }
  } catch {}
}

function openDetail() {
  showDetail.value = true
}

function onEdit() {
  showOptions.value = false
  editing.value     = true
}

async function onDelete() {
  showOptions.value = false
  if (!confirm('정말 삭제할까요?')) return
  await postStore.deletePost(localPost.id)
}

async function onToggleFollow() {
  showOptions.value = false
  if (isFollowing.value) await postStore.unfollow(localPost.author)
  else                  await postStore.follow(localPost.author)
  await postStore.fetchFeed()
}

async function refreshFeed() {
  editing.value = false
  await postStore.fetchFeed()
}

function sharePost() {
  const url = `${location.origin}/posts/${localPost.id}`
  navigator.clipboard.writeText(url)
    .then(() => {
      showCopiedOverlay.value = true
      setTimeout(() => showCopiedOverlay.value = false, 1500)
    })
    .catch(() => alert('복사 실패'))
}
</script>

<style scoped>
.post-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw; height: 100vh;
  padding: 2vh 2vw;
  background: transparent;
  box-sizing: border-box;
}


.card-inner {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%; height: auto;
  aspect-ratio: 4/3;
  max-width: 80vw; max-height: 80vh;
  padding: 32px 40px;
  background: #000;
  border: 1px solid #fff;
  border-radius: 8px;
  box-sizing: border-box;
}


/* 2) 헤더 · 푸터 높이 고정 */
.post-header,
.post-footer {
  flex: 0 0 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #000;
}


/* 헤더 스타일 */
.profile-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
}
.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;

}
.profile-name {
  font-size: 1rem;
}
.btn-options {
  margin-left: auto;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  /* 아래와 동일한 크기 설정 */
  font-size: 1.7rem;

}
.btn-options:hover {
  color: #fff;
}

/* 3) 이미지 래퍼: flex-grow 로 남은 공간을 차지 */
.post-images-wrapper {
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;   /* 자식 height:100% 동작용 */
  overflow: hidden;
}

.post-image-half {
  flex: 1;
  object-fit: cover;
  width: 50%;
  height: 100%;
  border-radius: 4px;
}

/* 양쪽 사진 모두 같은 규칙 */
.post-images-wrapper {
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;   /* 자식 height:100% 동작용 */
  overflow: hidden;
}

/* 푸터 텍스트 & 액션 */
.post-text {
  flex: 1;
  color: #fff;
  cursor: pointer;
}
.post-actions button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  margin-left: 16x;
  cursor: pointer;
}
.post-actions button:hover {
  color: #eee;
}

/* 복사 팝업 & 페이드 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.copy-popup {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  padding: .75rem 1.5rem;
  background: rgba(0,0,0,0.9);
  color: #fff;
  border-radius: 6px;
  z-index: 2000;
}
/* src/components/PostCard.vue <style scoped> */
.book-link {
  display: block;
  text-align: right;
  font-size: 0.875rem;           /* text-sm */
  color: #f472b6;                /* text-pink-400 */
  margin: 0.25rem;        /* mb-1 */
  cursor: pointer;               /* hover 효과를 위해 */
}
.book-link:hover {
  text-decoration: underline;    /* hover:underline */
}



</style>