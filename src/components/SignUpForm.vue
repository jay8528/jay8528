<!-- src/components/SignUpForm.vue -->
<template>
  <div class="login-container">
    <h1 class="logo">Inkera</h1>

    <form @submit.prevent="onSubmit">
      <!-- 프로필 사진 업로드 -->
      <div class="form-group">
        <label class="file-label">
          프로필 사진 선택
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
          />
        </label>
      </div>

<!-- 로그인 ID (핸들) -->
<div class="form-group">
  <input
    v-model="form.idname"
    class="text-input"
    placeholder="로그인 ID를 입력해주세요. (@ 없이 소문자/숫자/밑줄)"
    required
  />
</div>

<!-- 닉네임 -->
<div class="form-group">
  <input
    v-model="form.username"
    class="text-input"
    placeholder="프로필에 표시될 닉네임을 입력해주세요."
    required
  />
</div>


      <!-- 이메일 -->
      <div class="form-group">
        <input
          v-model="form.email"
          type="email"
          class="text-input"
          placeholder="이메일을 입력해주세요."
          required
        />
      </div>

      <!-- 비밀번호 -->
      <div class="form-group password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          class="text-input"
          placeholder="비밀번호를 입력해주세요."
          required
        />
        <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
          <!-- …토글 아이콘… -->
        </button>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="form-group password-wrapper">
        <input
          :type="showPassword2 ? 'text' : 'password'"
          v-model="form.password2"
          class="text-input"
          placeholder="비밀번호를 다시 입력해주세요."
          required
        />
        <button type="button" class="toggle-btn" @click="showPassword2 = !showPassword2">
          <!-- …토글 아이콘… -->
        </button>
      </div>

      <!-- 링크 그룹 -->
      <div class="link-group">
        <router-link to="/" class="underline">로그인</router-link>
      </div>

      <!-- 회원가입 버튼 -->
      <button class="submit-btn" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '가입 중…' : '회원가입' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter }     from 'vue-router'
import { useAuthStore }  from '@/stores/auth.js'
import axios              from '@/plugins/axios.js'

const router     = useRouter()
const authStore  = useAuthStore()

const form = reactive({
  idname: '',     // ✅ 로그인 ID
  username: '',   // ✅ 닉네임
  email:    '',
  password: '',
  password2:''
})

// 프로필 이미지 파일 담을 ref
const profileImage = ref(null)

const showPassword  = ref(false)
const showPassword2 = ref(false)
const isSubmitting  = ref(false)

// 파일 선택 시 실행
function onFileChange(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    profileImage.value = file
  } else {
    profileImage.value = null
    alert('이미지 파일만 업로드할 수 있습니다.')
  }
}

async function onSubmit() {
  if (form.password !== form.password2) {
    return alert('비밀번호가 일치하지 않습니다.')
  }

  isSubmitting.value = true

  try {
    const payload = new FormData()
    payload.append('idname',        form.idname)      // ✅ 새로 추가
    payload.append('username',      form.username)
    payload.append('email',         form.email)
    payload.append('password',      form.password)
    payload.append('password2',     form.password2)
    if (profileImage.value) {
      payload.append('profile_image', profileImage.value)
    }

    const { data } = await axios.post(
      '/api/auth/register/',
      payload,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    // 로그인 처리
    authStore.accessToken  = data.access
    authStore.refreshToken = data.refresh
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`

    await authStore.fetchProfile()
    router.push({ name: 'MainFeed' })
    } catch (err) {
      const errors = err.response?.data

      if (errors) {
        // 필드별 에러 처리
        if (errors.idname) {
          return alert('ID 오류: ' + errors.idname[0])
        }
        if (errors.username) {
          return alert('닉네임 오류: ' + errors.username[0])
        }
        if (errors.email) {
          return alert('이메일 오류: ' + errors.email[0])
        }
        if (errors.password) {
          return alert('비밀번호 오류: ' + errors.password[0])
        }
        if (typeof errors === 'string' || errors.detail) {
          return alert('오류: ' + (errors.detail || errors))
        }

        // 기타 형태 대응
        return alert('회원가입 실패: ' + JSON.stringify(errors))
      }

      // 네트워크 등 기타 에러
      alert('회원가입 실패: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* 컨테이너는 LoginForm.vue와 동일 */
.file-label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: rgba(255,255,255,0.8);
}
.file-label input[type="file"] {
  display: block;
  margin-top: 0.25rem;
}
.login-container {
  width: 90%; max-width: 480px;
  background: transparent;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.7);
  color: #fff; box-sizing:border-box;
}
.logo {
  font-size: clamp(2rem,8vw,5rem);
  text-align:center; margin-bottom:1.5rem;
}

.form-group { position:relative; margin-bottom:1.5rem; }
.text-input{
  width:100%;height:3rem;padding:0 1rem;font-size:1rem;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.3);border-radius:8px;color:#fff;
  transition:border-color .2s,background .2s;box-sizing:border-box;
}
.text-input::placeholder{color:rgba(255,255,255,0.5)}
.text-input:focus{outline:none;border-color:#7c3aed;background:rgba(255,255,255,0.1)}

.password-wrapper .text-input{padding-right:3rem}
.toggle-btn{
  position:absolute;top:50%;right:1rem;transform:translateY(-50%);
  background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;
}
.toggle-btn:hover{color:#fff}
.toggle-btn svg{width:1.25rem;height:1.25rem;stroke:currentColor;fill:none}

.link-group{text-align:center;font-size:.875rem;margin-bottom:1.5rem}
.link-group a{color:rgba(255,255,255,0.8);text-decoration:none}
.link-group a:hover{color:#fff}

.submit-btn{
  width:100%;padding:.75rem;background:#7c3aed;border:none;border-radius:9999px;
  color:#fff;font-size:1.125rem;cursor:pointer;transition:background .2s;margin-top:1rem;
}
.submit-btn:hover:not(:disabled){background:#5b21b6}
.submit-btn:disabled{opacity:.6;cursor:not-allowed}
</style>
