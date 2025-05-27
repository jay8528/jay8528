// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout          from '@/components/layout/MainLayout.vue'
import HomeView            from '@/views/HomeView.vue'
import LoginView           from '@/views/LoginView.vue'
import SignUpView          from '@/views/SignUpView.vue'
import MainFeed            from '@/views/MainFeed.vue'
import UserProfileView     from '@/views/UserProfileView.vue'
import PostDetailView      from '@/views/PostDetailView.vue'
import KakaoRedirectView   from '@/views/KakaoRedirectView.vue'
import NaverRedirectView   from '@/views/NaverRedirectView.vue'
import GoogleRedirectView  from '@/views/GoogleRedirectView.vue'
import PostCreateView      from '@/views/PostCreateView.vue'   // ⬅️ 추가
import BookDetailPage      from '@/views/BookDetailPage.vue'   // ⬅️ (풀 페이지)
import { useAuthStore }    from '@/stores/auth.js'

/* ─── 라우트 정의 ─── */
const routes = [
  // ─ 게스트(미로그인) 전용 ─
  { path: '/',        name: 'Home',           component: HomeView,           meta: { guestOnly: true } },
  { path: '/login',   name: 'Login',          component: LoginView,          meta: { guestOnly: true } },
  { path: '/signup',  name: 'SignUp',         component: SignUpView,         meta: { guestOnly: true } },

  // auth 리다이렉트 ─
  { path: '/kakao',   name: 'KakaoRedirect',  component: KakaoRedirectView,  meta: { guestOnly: true } },
  { path: '/naver',   name: 'NaverRedirect',  component: NaverRedirectView,  meta: { guestOnly: true } },
  { path: '/google',  name: 'GoogleRedirect', component: GoogleRedirectView, meta: { guestOnly: true } },

  // ─ 로그인 후 전용 레이아웃 ─
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'feed',
        name: 'MainFeed',
        component: MainFeed,
        meta: { requiresAuth: true, noScroll: true }
      },
      {
        path: 'profile/:idname',
        name: 'UserProfile',
        component: UserProfileView,
        props: true,
        meta: { requiresAuth: true }
      },
      /* 글쓰기 뷰 — /write */
      {
        path: 'write',
        name: 'PostCreate',
        component: PostCreateView,
        meta: { requiresAuth: true }
      },
      {
        path: '/books/:isbn(\\d+)',
        name: 'BookDetail',
        component: BookDetailPage,
        props: true,
        meta: { requiresAuth: true }   // 필요하면 false 로
      },
    ],
  },

  // ─ 개별 포스트 상세 ─
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetailView,
    props: true,
    meta: { requiresAuth: true }
  },
  // ─ 책 상세 풀 페이지 (옵션: 로그인 여부 무관) ─



  // ─ 잘못된 경로 → 홈으로 ─
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
]

/* ─── 라우터 인스턴스 ─── */
const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* ─── 전역 가드 ─── */
router.beforeEach((to, from, next) => {
  const auth       = useAuthStore()
  const isLoggedIn = !!auth.accessToken

  // ① 인증 필요하지만 로그인 안 됨 → 로그인 페이지로
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // ② 게스트 전용인데 이미 로그인됨 → 메인피드로
  if (to.meta.guestOnly && isLoggedIn) {
    return next({ name: 'MainFeed' })
  }

  // ③ 그 외 통과
  next()
})

export default router
