<template>
  <div class="loader"></div>
</template>

<script setup>
// 이 컴포넌트는 로딩 애니메이션만 담당합니다.
</script>

<style scoped>
.loader {
  width: 40px;
  height: 40px;
  margin: 1rem auto;
  border: 4px solid #444;
  border-top-color: #bb86fc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
