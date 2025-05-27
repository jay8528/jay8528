<template>
  <div id="app" class="relative min-h-screen overflow-x-hidden">
    <!-- 화면 전체를 덮는 fixed 배경 비디오 -->
    <video
      class="bg-video"
      :src="selectedVideo"
      autoplay muted loop playsinline
    ></video>

    <!-- 실제 콘텐츠 영역은 스크롤 가능 -->
    <div class="relative z-10">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const modules = import.meta.glob('@/assets/videos/*.mp4', { eager: true, import: 'default' })
const vids = Object.values(modules)
const selectedVideo = ref(vids[Math.floor(Math.random() * vids.length)])
</script>

<style>
.app-container {
  /* 전체 화면 */
  width: 100vw;
  height: 100vh;
  background-color: transparent;
}

.bg-video {
  position: fixed; /* ✅ absolute → fixed */
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;  
  filter: brightness(0.5); /* 50% 밝기 → 더 어둡게 */
}

#app {
  font-family: 'Nixgon', system-ui, sans-serif;
}
/* z-index 조정이 필요 없도록 Tailwind z-유틸 쓰셔도 됩니다 */
</style>
