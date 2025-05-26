<!-- src/views/PostCreateView.vue -->
<template>
  <div class="min-h-screen bg-black text-white p-6 space-y-6">
    <!-- 상단 바 -->
    <header class="flex items-center gap-4">
      <button @click="$router.back()" class="text-pink-400 text-xl">⟵</button>
      <h2 class="text-lg font-semibold">새 게시물 작성</h2>
    </header>

    <!-- 글 내용 -->
    <textarea
      v-model="form.content"
      placeholder="내용을 입력하세요"
      rows="6"
      class="w-full bg-zinc-800 p-3 rounded resize-vertical"
    ></textarea>

    <!-- 이미지 두 장 -->
    <input
      type="file"
      @change="onFile(1, $event)"
      accept="image/*"
      class="block mb-3"
    />
    <input
      type="file"
      @change="onFile(2, $event)"
      accept="image/*"
      class="block mb-6"
    />

    <!-- 선택된 책 미리보기 -->
    <div v-if="book" class="flex items-center gap-3 bg-zinc-900 p-3 rounded">
      <img :src="book.cover_small" class="w-14 h-20 object-cover rounded" />
      <div class="truncate">{{ book.title }}</div>
      <button class="ml-auto text-pink-400" @click="book = null">❌</button>
    </div>

    <!-- (디버그용) 선택된 book 객체 확인 -->
    <pre v-if="book" class="text-xs bg-zinc-800 p-2">
{{ book }}
    </pre>

    <!-- 책 선택·게시 버튼 -->
    <div class="flex gap-4">
      <button
        @click="showBookModal = true"
        class="flex-1 bg-pink-600 py-2 rounded"
      >
        책 선택
      </button>
      <button
        @click="submit"
        :disabled="!form.image1 || !form.image2 || isSubmitting"
        class="flex-1 bg-emerald-600 py-2 rounded disabled:opacity-50"
      >
        {{ isSubmitting ? '등록 중…' : '게시' }}
      </button>
    </div>
  </div>

  <!-- 책 검색 모달 -->
  <BookSearchModal
    v-if="showBookModal"
    @close="showBookModal = false"
    @picked="onBookPicked"
  />
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { usePostStore } from '@/stores/post.js'
import BookSearchModal from '@/components/BookSearchModal.vue'

const router        = useRouter()
const postStore     = usePostStore()
const showBookModal = ref(false)
const isSubmitting  = ref(false)

const form = reactive({
  content: '',
  image1:  null,
  image2:  null,
})

const book = ref(null)

// 책 선택 시: 검색 결과 sel → 단건 조회 → merge
async function onBookPicked(sel) {
  // 1) 우선 요약 정보 세팅
  book.value = sel
  showBookModal.value = false

  try {
    // 2) 상세 조회 API 호출 (ItemLookUp)
    const { data: detail } = await axios.get(`/api/books/lookup/${sel.isbn13}/`)
    // 3) merge: sel + detail
    book.value = { ...sel, ...detail }
  } catch (err) {
    console.error('Book lookup failed:', err)
    // 실패해도 sel로만 진행합니다.
  }
}

function onFile(idx, e) {
  const file = e.target.files[0]
  if (!file) return
  if (idx === 1) form.image1 = file
  else           form.image2 = file
}

async function submit() {
  if (!form.image1 || !form.image2) {
    return alert('이미지 두 장을 모두 첨부하세요.')
  }
  if (!book.value?.isbn13) {
    return alert('책을 선택하세요.')
  }

  isSubmitting.value = true
  try {
    const payload = new FormData()
    payload.append('content', form.content)
    payload.append('image1',  form.image1)
    payload.append('image2',  form.image2)
    payload.append('book',    book.value.id)       // book.id (DB PK)로
    // 또는 원래 컨벤션인 book_isbn13을 쓰려면 아래처럼:
    payload.append('book_isbn13', book.value.isbn13)

    await postStore.createPost(payload)
    router.replace({ name: 'MainFeed' })
  } catch (err) {
    console.error(err)
    alert('등록 실패')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
textarea { min-height: 6rem; }
</style>
