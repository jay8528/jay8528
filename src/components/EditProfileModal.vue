<template>
  <teleport to="body">
    <div class="modal-backdrop" @click.self="close">
      <div class="modal-container">
        <h3>회원 정보 수정</h3>
        <form @submit.prevent="submit">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="profileImage">프로필 이미지</label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              @change="onFileChange"
            />
          </div>
          <div class="actions">
            <button type="button" @click="close">취소</button>
            <button type="submit">저장</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios.js'

const props = defineProps({})
const emit = defineEmits(['close', 'updated'])

const form = ref({
  email: '',
  profile_image: null
})

onMounted(async () => {
  const { data } = await axios.get('/api/auth/profile/')  
  form.value.email = data.email
})

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) form.value.profile_image = file
}

async function submit() {
  try {
    const payload = new FormData()
    payload.append('email', form.value.email)
    if (form.value.profile_image) {
      payload.append('profile_image', form.value.profile_image)
    }
    await axios.patch('/api/auth/profile/', payload)
    emit('updated')
    close()
  } catch (err) {
    console.error('프로필 수정 실패', err)
    alert('수정에 실패했습니다.')
  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
/* 1) 배경 오버레이 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

/* 2) 모달 컨테이너 */
.modal-container {
  background: #1e1e1e;
  color: #e2e2e2;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

/* 3) 제목 */
.modal-container h3 {
  margin-bottom: 1rem;
  color: #fff;
}

/* 4) 폼 그룹 */
.form-group {
  margin-bottom: 1.25rem;
}
.form-group label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #ccc;
  margin-bottom: 0.5rem;
}

/* 5) 입력 필드 */
.form-group input[type="email"],
.form-group input[type="file"] {
  background: #2b2b2b;
  color: #e2e2e2;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 1rem;
}

/* 파일 선택 버튼 텍스트 톤 조정 */
.form-group input[type="file"]::file-selector-button {
  background: #333;
  color: #e2e2e2;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
}

/* 6) 액션 버튼 래퍼 */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* 7) 공통 버튼 스타일 */
.actions button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

/* 8) 저장 버튼 강조 */
.actions button[type="submit"] {
  background: #bb86fc;
  color: #1e1e1e;
  font-weight: 600;
}
.actions button[type="submit"]:hover:not(:disabled) {
  background: #a27be8;
}

/* 9) 취소 버튼 톤 다운 */
.actions button[type="button"] {
  background: #444;
  color: #ccc;
}
.actions button[type="button"]:hover {
  background: #555;
}

/* 10) disabled 상태 */
.actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
