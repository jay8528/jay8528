<template>
  <teleport to="body">
    <div class="overlay" @click.self="close">
      <div class="modal">
        <button
          v-if="isOwnPost"
          class="option-btn"
          @click="edit"
        >
          수정
        </button>
        <button
          v-if="isOwnPost"
          class="option-btn"
          @click="deletePost"
        >
          삭제
        </button>
        <button
          v-else
          class="option-btn"
          @click="handleToggleFollow"
        >
          {{ followText }}
        </button>
        <button
          class="option-btn cancel"
          @click="close"
        >
          취소
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useFollowStore } from '@/stores/follow'

const props = defineProps({
  isOwnPost: Boolean,
  userId: { type: Number, required: true },
  isFollowing: { type: Boolean, required: true }
})
const emit = defineEmits(['edit', 'delete', 'toggleFollow', 'close'])

const followStore = useFollowStore()

// 버튼 텍스트
const followText = computed(() =>
  props.isFollowing ? '팔로우 취소' : '팔로우'
)

// 팔로우 토글
async function handleToggleFollow() {
  try {
    if (props.isFollowing) {
      await followStore.unfollow(props.userId)
    } else {
      await followStore.follow(props.userId)
    }
    emit('toggleFollow')  // 부모에서 상태 갱신
  } catch (e) {
    console.error('팔로우 토글 실패', e)
    alert('팔로우 요청 중 문제가 발생했습니다.')
  }
  emit('close')
}

function edit() {
  emit('edit')
}
function deletePost() {
  emit('delete')
}
function close() {
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal {
  width: 90%;
  max-width: 360px;
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
}
.option-btn {
  display: block;
  width: 100%;
  padding: 14px 0;
  border: none;
  background: none;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  color: #e2e2e2;
  transition: background 0.2s;
}
.modal .option-btn + .option-btn {
  border-top: 1px solid #333;
}
.option-btn:hover {
  background: #2b2b2b;
}
.option-btn.cancel {
  color: #ff6b6b;
  font-weight: bold;
}
</style>
