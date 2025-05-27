<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="layout">
    <!-- ✅ 상단 네비게이션 -->
    <header class="topbar">
      <router-link :to="{ name: 'MainFeed' }" class="logo">Inkera</router-link>


      <div class="search-box" @click="openSearchModal">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          readonly
        />
        <img src="@/assets/icons/search.svg" class="icon" />
      </div>

<div class="icons">
  <img
    src="@/assets/icons/home.svg"
    class="icon"
    @click="goHome"
    title="홈"
  />
  <!-- 글쓰기 아이콘 -->
  <img
    src="@/assets/icons/plus.svg"
    class="icon"
    @click="router.push({ name: 'PostCreate' })"
    title="글쓰기"
  />

  <!-- 프로필 아이콘 -->
  <img
    src="@/assets/icons/profile.svg"
    class="icon"
    @click="goToProfile"
    title="프로필"
  />
  <!-- 메뉴 아이콘 -->
  <img
    src="@/assets/icons/menu.svg"
    class="icon"
    @click="toggleMenu"
    title="메뉴"
  />
</div>
    </header>

    <!-- ✅ 메인 컨텐츠 -->
    <section class="content" :class="{ 'no-scroll': disableScroll }">
      <router-view />
      <CreatePostModal
        v-if="showCreate"
        @close="showCreate = false"
      />
    </section>
  </div>
  <!-- ✅ 모달 삽입 -->

<MainMenuModal
  v-if="showMainMenu"
  @close="showMainMenu = false"
/>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import MainMenuModal from '@/components/MainMenuModal.vue'  // ✅ 추가

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const showCreate = ref(false)
const showMainMenu = ref(false)  // ✅ 추가

const isLoggedIn = computed(() => !!authStore.user?.id)
const disableScroll = computed(() => !!route.meta.noScroll)

function openSearchModal() {
  console.log('검색 모달 열기')
}

function goToProfile() {
  if (authStore.user?.idname) {
    router.push({ name: 'UserProfile', params: { idname: authStore.user.idname } })
  }
}
function goHome() {
  router.push({ name: 'MainFeed' })
}

function toggleMenu() {
  showMainMenu.value = true
}
</script>


<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: transparent;
  width: 100vw; /* ✅ 필요할 수 있음 */
}

/* ✅ 상단 바 */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;         /* ✅ 화면 전체 너비 */
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: space-between;

  /* ✅ 높이 키움 */
  padding: 20px 32px;

  /* ✅ 완전 투명한 배경 */
  background-color: transparent;

  /* ✅ 테두리 제거 */
  border-bottom: none;
  box-sizing: border-box; /* ✅ 패딩 포함 */
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #bb86fc;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: transparent;
  border-radius: 999px;
  border: 1px solid #444;
  padding: 12px 20px;          /* ✅ 내부 여백 넉넉하게 */
  width: 100%;
  max-width: 600px;            /* ✅ 너비 확장 */
  height: 48px;                /* ✅ 높이 증가 */
  box-sizing: border-box;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;             /* ✅ 글자 크기 증가 */
  outline: none;
  padding: 0 8px;
  &::placeholder {
    color: #aaa;
    font-size: 1rem;
  }
}

.icon {
  width: 30px;
  height: 30px;
  margin-left: 12px;
  cursor: pointer;
}

.icons {
  display: flex;
  gap: 12px;
}

/* ✅ 컨텐츠 */
.content {
  padding-top: 80px;
  flex: 1;
  color: #e2e2e2;
  overflow-y: auto;
  background-color: transparent;
}

.content.no-scroll {
  height: 100vh;
  overflow-y: hidden !important;
}
</style>
