<!-- src/components/BookSearchModal.vue -->
<template>
  <teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <h2 class="modal-title">책 검색</h2>

        <!-- 검색 입력 + 버튼 -->
        <div class="search-row">
          <input
            v-model="q"
            @keyup.enter="search"
            placeholder="책 제목 검색…"
            class="modal-input flex-1"
          />
          <button @click="search" class="search-btn">검색</button>
        </div>

        <!-- 리스트 단계 -->
        <template v-if="phase === 'list'">
          <!-- 1) 로딩 중이면 Loader 컴포넌트 표시 -->
          <Loader v-if="loading" />

          <!-- 2) 로딩 끝나면 결과 또는 ‘없음’ 메시지 -->
          <div v-else>
            <ul v-if="results.length" class="modal-list">
              <li
                v-for="b in results"
                :key="b.isbn13"
                class="modal-list-item"
                @click="open(b)"
              >
                <img :src="b.cover_small" class="item-thumb" />
                <span class="item-title">{{ b.title }}</span>
              </li>
            </ul>
            <div v-else class="p-4 text-center text-gray-400">
              검색 결과가 없습니다.
            </div>
          </div>

          <!-- 3) 페이징 (결과가 있을 때만) -->
          <div v-if="!loading && results.length" class="modal-pagination">
            <button @click="prevPage" :disabled="page === 1">이전</button>
            <span>{{ page }} / 3</span>
            <button @click="nextPage" :disabled="page === 3">다음</button>
          </div>
        </template>

        <!-- 상세 단계 -->
        <template v-else>
          <BookInlineDetail
            :book="selected"
            @back="phase = 'list'"
            @select="choose"
          />
        </template>

      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios'
import Loader from '@/components/Loader.vue'
import BookInlineDetail from '@/components/BookInlineDetail.vue'

const emit     = defineEmits(['close','picked'])
const q        = ref('')
const page     = ref(1)
const results  = ref([])
const phase    = ref('list')
const selected = ref(null)
const loading  = ref(false)    // 로딩 상태 정의

async function search() {
  if (!q.value) {
    results.value = []
    return
  }
  loading.value = true         // 검색 시작
  try {
    const { data } = await axios.get('/api/books/search/', {
      params: { q: q.value, page: page.value }
    })
    results.value = data
  } catch (e) {
    console.error(e)
    results.value = []
  } finally {
    loading.value = false      // 검색 끝
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    search()
  }
}

function nextPage() {
  if (page.value < 3) {
    page.value++
    search()
  }
}

function open(b) {
  selected.value = b
  phase.value    = 'detail'
}

function choose(book) {
  console.log("📚 선택된 Book 객체:", book)
  emit('picked', book)
  emit('close')
  phase.value = 'list'
  selected.value = null
}


</script>


<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: #1e1e1e;
  color: #e2e2e2;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

.modal-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #fff;
}

.search-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.modal-input {
  padding: 0.5rem;
  background: #2b2b2b;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e2e2e2;
}

.search-btn {
  background: #bb86fc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  color: #1e1e1e;
}

.modal-list {
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.modal-list-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  border-bottom: 1px solid #333;
}

.modal-list-item:hover {
  background: #2b2b2b;
}

.item-thumb {
  width: 40px;
  height: 56px;
  object-fit: cover;
  margin-right: 0.75rem;
  border-radius: 4px;
}

.item-title {
  flex: 1;
  color: #e2e2e2;
}

.modal-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-pagination button {
  background: #2b2b2b;
  border: 1px solid #444;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  color: #e2e2e2;
  cursor: pointer;
}

.modal-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-btn {
  background: none;
  border: none;
  color: #bb86fc;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: 1rem;
}

.detail-content {
  text-align: center;
}

.detail-thumb {
  width: 120px;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.detail-title {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.detail-authors {
  font-size: 0.875rem;
  color: #aaa;
  margin-bottom: 1rem;
}

.select-btn {
  background: #bb86fc;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  color: #1e1e1e;
  cursor: pointer;
}
</style>
