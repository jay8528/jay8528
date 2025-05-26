<!-- src/views/PostDetailView.vue -->
<template>
  <div class="detail-view-wrapper">
    <div class="modal-content">
      <!-- 왼쪽: 이미지 -->
      <div class="modal-left">
        <img :src="post.image" alt="Post image" class="modal-image" />
      </div>

      <!-- 오른쪽: 댓글 패널 -->
      <div class="modal-right">
        <!-- 헤더: 프로필 + 유저네임 + 공유 버튼 -->
        <div class="modal-header">
          <div class="author-info">
            <img
              :src="post.author_profile_image"
              alt="avatar"
              class="header-avatar"
            />
            <span class="header-username">{{ post.author_username }}</span>
          </div>
          <button class="btn-share" @click="onShare">🔗 공유</button>
        </div>

        <!-- 댓글 리스트 -->
        <div class="modal-comments">
          <div
            v-for="c in comments"
            :key="c.id"
            class="comment-item"
          >
            <img
              :src="c.profile_image"
              alt="avatar"
              class="comment-avatar"
            />
            <div class="comment-body">
              <p class="comment-text">
                <strong>{{ c.username }}</strong> {{ c.content }}
              </p>
              <button
                class="comment-like-btn"
                @click="toggleCommentLike(c)"
              >
                <span v-if="c.is_liked">❤️</span>
                <span v-else>🤍</span>
                {{ c.like_count }}
              </button>
            </div>
          </div>
        </div>

        <!-- 댓글 입력 -->
        <div class="modal-input">
          <input
            v-model="newComment"
            type="text"
            placeholder="댓글 달기..."
            @keyup.enter="postComment"
          />
          <button
            @click="postComment"
            :disabled="!newComment.trim()"
          >
            게시
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'  // axios 설정에 맞게 경로 조정

const props      = defineProps({ id: [String, Number] })
const post       = ref({})
const comments   = ref([])
const newComment = ref('')

async function fetchData() {
  const { data: p } = await axios.get(`/api/posts/${props.id}/`)
  post.value = p
  const { data: cs } = await axios.get(`/api/posts/${props.id}/comments/`)
  comments.value = cs
}

async function postComment() {
  const content = newComment.value.trim()
  if (!content) return
  await axios.post(`/api/posts/${props.id}/comments/`, { content })
  newComment.value = ''
  await fetchData()
}

async function toggleCommentLike(c) {
  const url = `/api/posts/${props.id}/comments/${c.id}`
  if (!c.is_liked) {
    await axios.post(`${url}/like/`)
  } else {
    await axios.delete(`${url}/unlike/`)
  }
  await fetchData()
}

function onShare() {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({ url })
  } else {
    navigator.clipboard.writeText(url)
      .then(() => alert('링크가 복사되었습니다.'))
  }
}

onMounted(fetchData)
</script>

<style scoped>
.detail-view-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  background: #000;
}

.modal-content {
  display: flex;
  width: 80vw;
  height: 80vh;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  color: #e2e2e2;
}

.modal-left {
  flex: 2;
  background: #000;
}
.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #2b2b2b;
}

/* 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #333;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.header-username {
  font-weight: 600;
  color: #f0f0f0;
}
.btn-share {
  background: none;
  border: none;
  color: #0095f6;
  cursor: pointer;
  font-size: 1rem;
}
.btn-share:hover { opacity: 0.8; }

/* 댓글 리스트 */
.modal-comments {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 1rem;
}
.comment-item {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.comment-body {
  flex: 1;
}
.comment-text {
  margin: 0;
  line-height: 1.4;
}
.comment-like-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #e2e2e2;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
.comment-like-btn:hover { opacity: 0.8; }

/* 댓글 입력 */
.modal-input {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-top: 1px solid #333;
}
.modal-input input {
  flex: 1;
  background: #1e1e1e;
  color: #e2e2e2;
  border: none;
  outline: none;
  padding: 0.5rem;
  border-radius: 4px;
}
.modal-input input::placeholder {
  color: #888;
}
.modal-input button {
  background: none;
  border: none;
  color: #0095f6;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
}
.modal-input button:disabled {
  opacity: 0.3;
  cursor: default;
}
</style>
