<!-- src/components/LoginForm.vue -->
<template>
  <div class="login-container">
    <h1 class="logo">Inkera</h1>

    <form @submit.prevent="onSubmit">
      <!-- 아이디 -->
    <div class="form-group">
      <input
        v-model="form.idname"
        class="text-input"
        placeholder="로그인 ID (@ 없이 입력)"
        required
      />
    </div>

      <!-- 비밀번호 -->
      <div class="form-group password-wrapper">
        <input :type="showPassword ? 'text' : 'password'"
               v-model="form.password"
               class="text-input"
               placeholder="비밀번호를 입력해주세요."
               required />
        <button type="button"
                class="toggle-btn"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? '숨기기' : '보이기'">
          <!-- eye / eye-off SVG -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="!showPassword"
                  d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
            <circle v-if="!showPassword" cx="12" cy="12" r="2.5"/>
            <path v-else
                  d="M1 1l22 22M4.8 4.8C2.3 7.3 1 10.5 1 12c0 1.5 1.3 4.7 3.8 7.2A16.4 16.4 0 0012 23c7 0 11-7 11-7a17.3 17.3 0 00-3.8-4.8M9.5 9.5A2.5 2.5 0 0112 13c.8 0 1.5-.3 2-.8"/>
          </svg>
        </button>
      </div>

      <!-- 링크 -->
      <div class="link-group">
        <a href="#">아이디 찾기</a><span>｜</span>
        <a href="#">비밀번호 찾기</a><span>｜</span>
        <router-link to="/signup" class="underline">
          회원가입
        </router-link>
      </div>

      <!-- 로그인 버튼 -->
      <button class="submit-btn" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '로그인 중…' : '로그인' }}
      </button>

            <!-- 간편 로그인 -->
      <div class="social-login-label">간편로그인</div>
      <div class="social-login">
        <a href="https://kauth.kakao.com/oauth/authorize?client_id=22747c3b67751e599cfd3231b7e603dd&redirect_uri=http://localhost:5173/kakao&response_type=code">
          <img src="@/assets/icons/kakao.svg" alt="Kakao Login" />
        </a>

        <a href="https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=QJdGF7sZfWq0zU6SJQ1h&redirect_uri=http://localhost:5173/naver&state=naver1234">
          <img src="@/assets/icons/naver.svg" alt="Naver Login" />
        </a>
        <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=315527699160-nk4r0tbihqhs06r2ho3n20b1s12b8d8t.apps.googleusercontent.com&redirect_uri=http://localhost:5173/google&response_type=code&scope=openid%20email%20profile&access_type=offline"
>
          <img src="@/assets/icons/google.svg" alt="Google Login" />
        </a>
          </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref }  from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore }   from '@/stores/auth.js'

const router     = useRouter()
const route      = useRoute()
const authStore  = useAuthStore()

const form = reactive({ idname: '', password: '' }) 
const showPassword  = ref(false)
const isSubmitting  = ref(false)

async function onSubmit () {
  isSubmitting.value = true
  try {
    /* ① 스토어 액션 호출: 토큰 저장·헤더세팅은 내부에서 처리됨 */
    await authStore.login(form)

    /* ② 이동: redirect 쿼리 있으면 사용, 없으면 MainFeed */
    const target = route.query.redirect || { name: 'MainFeed' }
    router.push(target)

  } catch (err) {
    alert('로그인 실패: ' + (err.response?.data?.detail || err.message))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* ==== 컨테이너 ==== */
.login-container {
  width: 90%; max-width: 480px;
  background: transparent;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.7);
  color: #fff; box-sizing: border-box;
}

/* 로고 */
.logo { font-size: clamp(2rem,8vw,5rem); text-align:center; margin-bottom:1.5rem; }

/* 입력 래퍼 */
.form-group { position:relative; margin-bottom:1.5rem; }

/* 공통 input */
.text-input{
  width:100%;height:3rem;padding:0 1rem;font-size:1rem;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.3);border-radius:8px;color:#fff;
  transition:border-color .2s,background .2s;box-sizing:border-box;
}
.text-input::placeholder{color:rgba(255,255,255,0.5)}
.text-input:focus{outline:none;border-color:#7c3aed;background:rgba(255,255,255,0.1)}

/* eye 버튼 */
.password-wrapper .text-input{padding-right:3rem}
.toggle-btn{
  position:absolute;top:50%;right:1rem;transform:translateY(-50%);
  background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;
}
.toggle-btn:hover{color:#fff}
.toggle-btn svg{width:1.25rem;height:1.25rem;stroke:currentColor;fill:none}

/* 링크 그룹 */
.link-group{text-align:center;font-size:.875rem;margin-bottom:1.5rem}
.link-group a{color:rgba(255,255,255,0.8);text-decoration:none;margin:0 .25rem}
.link-group span{color:rgba(255,255,255,0.5)}

/* 로그인 버튼 */
.submit-btn{
  width:100%;padding:.75rem;background:#7c3aed;border:none;border-radius:9999px;
  color:#fff;font-size:1.125rem;cursor:pointer;transition:background .2s;margin-bottom:1.5rem;
}
.submit-btn:hover:not(:disabled){background:#5b21b6}
.submit-btn:disabled{opacity:.6;cursor:not-allowed}

/* 구분선 */
.divider{position:relative;text-align:center;font-size:.875rem;
        color:rgba(255,255,255,0.5);margin:2rem 0 1rem}
.divider::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
                 background:rgba(255,255,255,0.3)}
.divider span{display:inline-block;margin-top:.75rem;background:transparent;padding:0 .5rem}

/* 소셜 아이콘 */
.social-login-label {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  font-size: 1rem;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.social-login img {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s;
}

.social-login img:hover {
  transform: scale(1.1);
}
</style>
