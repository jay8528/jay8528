<!-- src/components/BookDetail.vue -->
<template>
  <div class="book-detail">
    <!-- 0) 로딩 / 에러 -->
    <div v-if="loading" class="loading">불러오는 중…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <!-- 1. 표지 -->
      <div class="cover-wrapper">
        <img
          v-if="book.cover_large"
          :src="book.cover_large"
          alt="Book cover"
          class="book-cover"
        />
        <div v-else class="cover-placeholder">
          Cover<br/>정보 없음
        </div>
      </div>

      <!-- 2. 메타 정보 -->
      <div class="info-wrapper">
        <h2 class="book-title">{{ book.title || '제목 정보 없음' }}</h2>
        <p class="book-authors">
          {{ book.authors || '저자 정보 없음' }}
        </p>
        <dl class="book-meta">
          <div class="meta-item">
            <dt>출판사</dt>
            <dd>{{ book.publisher || '정보 없음' }}</dd>
          </div>
          <div class="meta-item">
            <dt>ISBN</dt>
            <dd>{{ book.isbn13 || '정보 없음' }}</dd>
          </div>
          <div class="meta-item">
            <dt>페이지</dt>
            <dd>{{ book.pages != null ? book.pages : '—' }}</dd>
          </div>
        </dl>

        <button class="detail-btn" @click="goToLink" :disabled="!book.link">
          자세히 보기
        </button>

        <p class="db-credit">도서 DB 제공: 알라딘</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute }       from 'vue-router'
import axios              from '@/plugins/axios.js'

const route   = useRoute()
const isbn    = route.params.isbn

const book    = ref({})
const loading = ref(true)
const error   = ref('')

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/books/lookup/${isbn}/`)
    book.value = data
  } catch (e) {
    console.error(e)
    error.value = '책 정보를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
})

function goToLink() {
  if (book.value.link) {
    window.open(book.value.link, '_blank')
  }
}
</script>

<style scoped>
.book-detail {
  /* ─── login-container 느낌 ─── */
  width: 90%;
  max-width: 480px;
  background: rgba(51, 51, 51, 0.6);
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.7);
  color: #fff;
  box-sizing: border-box;
  /* 화면 전체를 덮는 fixed 레이어로 */
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 내부 레이아웃 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading,
.error {
  margin: 2rem 0;
  color: #bbb;
}
.error { color: #e66; }

.cover-wrapper {
  width: 60%;
  max-width: 240px;
  aspect-ratio: 3 / 4;
  margin-bottom: 1rem;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: #333;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9rem;
  border-radius: 4px;
}

.info-wrapper {
  width: 100%;
  max-width: 320px;
  text-align: left;
}

.book-title {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  color: #fff;
}

.book-authors {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #bbb;
}

.book-meta {
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.meta-item dt {
  width: 60px;
  font-weight: bold;
}

.meta-item dd {
  margin: 0 0 0 0.5rem;
  color: #ccc;
}

.detail-btn {
  display: inline-block;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.detail-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.db-credit {
  font-size: 0.75rem;
  text-align: right;
  color: #555;
}
</style>
