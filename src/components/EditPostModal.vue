<!-- src/components/EditPostModal.vue -->
<template>
  <teleport to="body">
    <div class="overlay" @click.self="$emit('close')">
      <div class="modal">
        <h2>게시글 수정</h2>
        <form @submit.prevent="onSubmit">
          <label class="field">
            <span class="label-text">내용</span>
            <textarea v-model="form.content" rows="4" required />
          </label>
          <div class="buttons">
            <button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? '저장 중…' : '저장하기' }}
            </button>
            <button type="button" @click="$emit('close')">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from '@/plugins/axios.js'

const props = defineProps({ post: Object })
const emit  = defineEmits(['close','updated'])

const isSubmitting = ref(false)
const form = reactive({
  title:   props.post.title,
  content: props.post.content
})

async function onSubmit() {
  isSubmitting.value = true
  try {
    await axios.patch(`/api/posts/${props.post.id}/`, {
      title: form.title,
      content: form.content
    })
    emit('updated')
    emit('close')
  } catch {
    alert('수정 실패')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* 1) 오버레이 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 2) 모달 박스 */
.modal {
  background: #1e1e1e;
  color: #e2e2e2;
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
}


/* 4) 입력 필드 래퍼 */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

/* 레이블 텍스트 */
.label-text {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #ccc;
}

/* 5) 인풋과 텍스트에어리어 */
.modal input,
.modal textarea {
  background: #2b2b2b;
  color: #e2e2e2;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 1rem;
  resize: vertical;
}

/* 6) 버튼 그룹 */
.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* 7) 공통 버튼 스타일 */
.buttons button {
  background: #2b2b2b;
  color: #e2e2e2;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

/* 8) 제출 버튼 강조 */
.buttons button[type="submit"] {
  border-color: #bb86fc;
}

/* 9) 취소 버튼은 옅은 톤 */
.buttons button[type="button"] {
  opacity: 0.8;
}

/* 10) hover & disabled */
.buttons button:not(:disabled):hover {
  background: #333;
  border-color: #666;
}
.buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
