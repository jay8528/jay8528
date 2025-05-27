<!-- src/components/PostDetailModal.vue -->
<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <!-- 왼쪽: 이미지 -->
        <div class="modal-left">
          <img :src="post.image" alt="Post image" class="modal-image" />
        </div>

        <!-- 오른쪽: 댓글 패널 -->
        <div class="modal-right">
          <!-- 헤더 -->
          <div class="modal-header">
            <router-link
              v-if="post.author_idname"
              :to="{ name: 'UserProfile', params: { idname: post.author_idname } }"
              class="profile-link"
              @click.stop
            >
              <img :src="post.author_profile_image" alt="avatar" class="header-avatar" />
              <div class="header-username-group">
                <div class="header-username">{{ post.author_username }}</div>
                <div class="handle">@{{ post.author_idname }}</div>
              </div>
            </router-link>


          </div>


          <!-- 댓글 리스트 -->
          <div class="modal-comments">
            <div
              v-for="c in comments"
              :key="c.id"
              class="comment-item"
            >
              <router-link
                :to="{ name: 'UserProfile', params: { idname: c.idname } }"
                class="comment-avatar-link"
                @click.stop
              >
                <img :src="c.profile_image" class="comment-avatar" />
              </router-link>
              <div class="comment-body">
                <p class="comment-text">
              <router-link
                :to="{ name: 'UserProfile', params: { idname: c.idname } }"
                class="comment-author-link"
                @click.stop
              >
                <strong>{{ c.username }}</strong>
                <span class="handle">@{{ c.idname }}</span>
              </router-link>
                  {{ c.content }}
                </p>
                <button class="comment-like-btn" @click="toggleCommentLike(c)">
                  <span v-if="c.is_liked">❤️</span>
                  <span v-else>🤍</span>
                  {{ c.like_count }}
                </button>
              </div>
            </div>
          </div>
          <!-- 좋아요 & 공유 버튼 -->
          <div class="modal-actions">
            <button class="like-button" @click="toggleLike">
              <span v-if="post.is_liked">❤️</span>
              <span v-else>🤍</span>
              {{ post.likes_count }}
            </button>
            <button class="share-button" @click="sharePost">🔗</button>
          </div>

          <!-- 댓글 입력 -->
          <div class="modal-input">
            <textarea
              v-model="newComment"
              class="comment-textarea"
              placeholder="댓글 달기..."
              @keyup.enter="postComment"
            ></textarea>
            <button @click="postComment" :disabled="!newComment.trim()">게시</button>
          </div>

          <!-- 복사 팝업 -->
          <transition name="fade">
            <div v-if="showCopiedOverlay" class="copy-popup">
              링크가 복사되었습니다!
            </div>
          </transition>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  postId: { type: [String, Number], required: true }
})
const emit = defineEmits(['close'])

const post = ref({})
const comments = ref([])
const newComment = ref('')
const showCopiedOverlay = ref(false)

// 포스트/댓글 불러오기
async function fetchPost() {
  const { data } = await axios.get(`/api/posts/${props.postId}/`)
   console.log('📬 fetched post:', data)    
  post.value = data
}
async function fetchComments() {
  const { data } = await axios.get(
    `/api/posts/${props.postId}/comments/`
  )
  comments.value = data
}

// 댓글 작성
async function postComment() {
  const content = newComment.value.trim()
  if (!content) return
  await axios.post(`/api/posts/${props.postId}/comments/`, { content })
  newComment.value = ''
  await Promise.all([fetchPost(), fetchComments()])
}

// 댓글 좋아요 토글
async function toggleCommentLike(c) {
  const base = `/api/posts/${props.postId}/comments/${c.id}`
  if (c.is_liked) await axios.delete(`${base}/unlike/`)
  else await axios.post(`${base}/like/`)
  await fetchComments()
}

// **좋아요 토글** (포스트)
async function toggleLike() {
  const base = `/api/posts/${props.postId}`
  if (post.value.is_liked) await axios.delete(`${base}/unlike/`)
  else await axios.post(`${base}/like/`)
  await fetchPost()
}

// **공유 버튼** (클립보드 복사 + 팝업)
function sharePost() {
  const url = `${window.location.origin}/posts/${props.postId}`
  navigator.clipboard.writeText(url)
    .then(() => {
      showCopiedOverlay.value = true
      setTimeout(() => (showCopiedOverlay.value = false), 1500)
    })
    .catch(() => alert('복사에 실패했습니다.'))
}

function close() {
  emit('close')
}

onMounted(() => {
  fetchPost()
  fetchComments()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  width: 80vw; height: 80vh;
  background: #1e1e1e; border-radius: 8px;
  overflow: hidden; color: #e2e2e2;
}

.modal-left { flex: 2; background: #000; }
.modal-image {
  width: 100%; height: 100%; object-fit: cover;
}

.modal-right {
  flex: 1; display: flex; flex-direction: column;
  background: #2b2b2b;
}

/* 헤더 */
.modal-header {
  display: flex; align-items: center;
  padding: 1rem; border-bottom: 1px solid #333;
}
.header-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  object-fit: cover; margin-right: 0.75rem;
}
.header-username {
  font-weight: 600; font-size: 14px; color: #f0f0f0;
}

/* 좋아요 & 공유 버튼 영역 */
.modal-actions {
  display: flex; gap: 1rem;
  padding: 0.75rem 1rem; border-bottom: 1px solid #333;
}
.like-button, .share-button {
  background: none; border: none; cursor: pointer;
  font-size: 1.25rem; color: #e2e2e2;
}
.like-button:hover, .share-button:hover {
  background: rgba(255,255,255,0.1); border-radius: 50%;
}

/* 댓글 리스트 */
.modal-comments {
  flex: 1; overflow-y: auto; padding: 0.5rem 1rem;
}
.comment-item {
  display: flex; gap: 0.75rem; margin-bottom: 1rem;
}
.comment-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  object-fit: cover;
}
.comment-body { flex: 1; }
.comment-text { margin: 0; line-height: 1.4; color: #e2e2e2; }
.comment-like-btn {
  background: none; border: none; cursor: pointer;
  color: #e2e2e2; font-size: 0.9rem; margin-top: 0.25rem;
}
.comment-like-btn:hover { opacity: 0.8; }

/* 댓글 입력 */
.modal-input {
  display: flex; align-items: center;
  padding: 0.5rem 1rem; border-top: 1px solid #333;
}
.comment-textarea {
  width: 100%;
  height: 80px;       /* 원하는 만큼 늘립니다 */
  resize: none;       /* 사용자가 크기 조절 못 하도록 */
  background: #1e1e1e;
  color: #e2e2e2;
  border: none;
  outline: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}
.modal-input button {
  background: none; border: none; cursor: pointer;
  color: #0095f6; font-weight: 600;
  margin-left: 1rem;
}
.modal-input button:disabled { opacity: 0.3; cursor: default; }

/* 클립보드 복사 팝업 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.copy-popup {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 2000;
  text-align: center;
}
.profile-link,
.comment-avatar-link,
.comment-username {
  color: #e2e2e2;       /* 원하시는 텍스트 색으로 바꿔 주세요 */
  text-decoration: none;
}

.profile-link:hover,
.comment-username:hover {
  color: #fff;         /* 호버했을 때 강조색 */
}
</style>
