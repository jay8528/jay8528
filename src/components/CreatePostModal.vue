<!-- src/components/CreatePostModal.vue -->
<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h2>새 게시물 만들기</h2>
      <form @submit.prevent="submit">
        <textarea
          v-model="form.content"
          placeholder="내용"
        ></textarea>
          <input
            type="file"
            @change="onFileChange(1, $event)"
            accept="image/*"
            required
          />
          <input
            type="file"
            @change="onFileChange(2, $event)"
            accept="image/*"
            required
          />
        <div class="actions">
          <button type="button" @click="onClose">취소</button>
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? '등록 중…' : '등록' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post.js'

const emit = defineEmits(['close'])
const router = useRouter()
const postStore = usePostStore()

const form = reactive({
  content: '',
  image1: null,
  image2: null,
})

const imageFile     = ref(null)
const isSubmitting = ref(false)

function onFileChange(index, e) {
  const file = e.target.files[0]
  if (index === 1) form.image1 = file
  else if (index === 2) form.image2 = file
}


function onClose() {
  emit('close')
}

async function submit() {
  if (!form.image1 || !form.image2) {
    return alert('이미지를 첨부해주세요.')
  }
  isSubmitting.value = true
  try {
    await postStore.createPost({
      content: form.content,
      image1: form.image1,
      image2: form.image2,
    })
    form.content = ''
    form.image1 = null
    form.image2 = null
    onClose()
    router.push({ name: 'MainFeed' })
  } catch (err) {
    console.error(err)
    alert('등록에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* 배경 어둡게, 화면 전체 덮기 */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

/* 모달 박스 다크 테마 */
.modal {
  background: #1e1e1e;
  color: #e2e2e2;
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

/* 제목 */
.modal h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #fff;
}

/* 텍스트 영역 */
.modal textarea {
  width: 100%;
  min-height: 100px;
  background: #2b2b2b;
  color: #e2e2e2;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem;
  resize: vertical;
  margin-bottom: 1rem;
}

/* 파일 입력 */
.modal input[type="file"] {
  display: block;
  background: #2b2b2b;
  color: #e2e2e2;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

/* 버튼 그룹 */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* 공통 버튼 스타일 */
.actions button {
  background: #2b2b2b;
  color: #e2e2e2;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

/* 취소 버튼은 조금 가벼운 톤으로 */
.actions button[type="button"] {
  opacity: 0.8;
}

/* 등록 버튼 강조 색상 */
.actions button[type="submit"] {
  border-color: #bb86fc;
}

/* hover/disabled */
.actions button:not(:disabled):hover {
  background: #333;
  border-color: #666;
}
.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
