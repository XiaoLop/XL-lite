<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loginApi, getCaptchaApi } from '@/api/auth'
import { Form, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import { useRouter } from 'vue-router'
import { showError } from '@/hooks/toast'
import type { HttpResponse } from '@/types/request.type'
import LogoImg from '@/assets/logo.png'
import { useThemeStore } from '@/stores/theme.store'

const th = useThemeStore()
const router = useRouter()
const captchaImage = ref('')
const captchaId = ref('')
const logging = ref(false)
const title = import.meta.env.VITE_TITLE
const footer = import.meta.env.VITE_FOOTER
const getCaptcha = async () => {
  const { data } = await getCaptchaApi()
  captchaImage.value = data.captchaImage
  captchaId.value = data.captchaId
}

const login = async (e: FormSubmitEvent) => {
  if (!e.valid) {
    return
  }

  try {
    logging.value = true
    const query = {
      username: e.states.username?.value,
      password: e.states.password?.value,
      captchaId: captchaId.value,
      captcha: e.states.captcha?.value,
    }
    const { data } = await loginApi(query)
    localStorage.setItem('access_token', data.accessToken)
    await th.loadDynamicRoutes(router)
    logging.value = false
    router.push('/')
  } catch (error: unknown) {
    const errorMessage = (error as HttpResponse<unknown>).message
    showError(errorMessage)
    await getCaptcha()
  } finally {
    logging.value = false
  }
}

const resolver = (values: FormResolverOptions) => {
  const errors: Record<string, { message: string }[]> = {
    username: [],
    password: [],
    captcha: [],
  }

  if (!values.values.username) {
    errors.username = [{ message: '请输入用户名' }]
  }

  if (!values.values.password) {
    errors.password = [{ message: '请输入密码' }]
  }

  if (!values.values.captcha) {
    errors.captcha = [{ message: '请输入验证码' }]
  }

  return { errors }
}

onMounted(() => {
  getCaptcha()
})
</script>

<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration pointer-events-none absolute inset-0 z-0">
      <div class="circle circle-1 absolute rounded-full -top-50 -left-50 w-150 h-150"></div>
      <div class="circle circle-2 absolute rounded-full -bottom-25 -right-25 w-100 h-100"></div>
      <div class="circle circle-3 absolute rounded-full top-1/2 left-[30%] w-7500px]"></div>
      <div class="grid-pattern absolute inset-0"></div>
    </div>

    <div
      class="login-wrapper relative z-1 flex flex-1 items-center justify-center gap-0 p-8 max-w-300 mx-auto w-full"
    >
      <!-- 左侧品牌展示区 -->
      <div class="brand-section hidden lg:flex flex-1 items-center justify-center p-12">
        <div class="brand-content text-center">
          <div class="logo mb-6 flex items-center justify-center gap-4">
            <img
              :src="LogoImg"
              alt="XL Lite Logo"
              class="logo-img w-32 h-32 object-contain transition-transform duration-300 hover:scale-105"
            />
            <h1 class="brand-title text-3xl font-bold">{{ title }}</h1>
          </div>
          <div class="brand-features flex flex-col gap-3 items-start mx-auto w-fit">
            <div class="feature-item flex items-center gap-2 text-base">
              <i class="pi pi-check-circle text-primary"></i>
              <span>开源后台管理系统</span>
            </div>
            <div class="feature-item flex items-center gap-2 text-base">
              <i class="pi pi-check-circle text-primary"></i>
              <span>灵活的权限控制</span>
            </div>
            <div class="feature-item flex items-center gap-2 text-base">
              <i class="pi pi-check-circle text-primary"></i>
              <span>智能的数据分析</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单区 -->
      <div class="form-section flex-1 flex items-center justify-center p-4 lg:p-8 w-full">
        <Form
          v-slot="$form"
          :resolver="resolver"
          @submit="login"
          class="login-form w-full max-w-105 p-6 sm:p-10 rounded-2xl sm:rounded-3xl backdrop-blur-[10px]"
        >
          <div class="form-header text-center mb-8">
            <h2 class="form-title text-2xl font-semibold mb-2">欢迎回来</h2>
            <p class="form-desc text-sm">请登录您的账号以继续</p>
          </div>

          <div class="form-body flex flex-col gap-5">
            <!-- 用户名 -->
            <div class="field-group flex flex-col gap-2">
              <label class="field-label text-sm font-medium">用户名</label>
              <IconField>
                <InputIcon class="pi pi-user" />
                <InputText
                  name="username"
                  class="w-full"
                  placeholder="请输入用户名"
                  :class="{ 'p-invalid': $form.username?.invalid }"
                />
              </IconField>
              <small
                v-if="$form.username?.invalid"
                class="error-message text-xs flex items-center gap-1 text-red-500"
              >
                <i class="pi pi-exclamation-circle"></i>
                {{ $form.username.error.message }}
              </small>
            </div>

            <!-- 密码 -->
            <div class="field-group flex flex-col gap-2">
              <label class="field-label text-sm font-medium">密码</label>
              <IconField>
                <InputIcon class="pi pi-lock" />
                <InputText
                  name="password"
                  type="password"
                  class="w-full"
                  placeholder="请输入密码"
                  :class="{ 'p-invalid': $form.password?.invalid }"
                />
              </IconField>
              <small
                v-if="$form.password?.invalid"
                class="error-message text-xs flex items-center gap-1 text-red-500"
              >
                <i class="pi pi-exclamation-circle"></i>
                {{ $form.password.error.message }}
              </small>
            </div>

            <!-- 验证码 -->
            <div class="field-group flex flex-col gap-2">
              <label class="field-label text-sm font-medium">验证码</label>
              <div class="captcha-row flex gap-3 items-center">
                <InputText
                  name="captcha"
                  class="captcha-input flex-1"
                  placeholder="请输入验证码"
                  :class="{ 'p-invalid': $form.captcha?.invalid }"
                />
                <div
                  class="captcha-image w-30 h-10.5 rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
                  @click="getCaptcha"
                  title="点击刷新验证码"
                >
                  <img
                    v-if="captchaImage"
                    :src="captchaImage"
                    alt="验证码"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="captcha-placeholder w-full h-full flex items-center justify-center bg-surface-100"
                  >
                    <i class="pi pi-spinner pi-spin text-muted-color"></i>
                  </div>
                </div>
              </div>
              <small
                v-if="$form.captcha?.invalid"
                class="error-message text-xs flex items-center gap-1 text-red-500"
              >
                <i class="pi pi-exclamation-circle"></i>
                {{ $form.captcha.error.message }}
              </small>
            </div>
          </div>

          <div class="form-footer mt-8">
            <Button
              type="submit"
              class="w-full py-3.5 text-base font-semibold rounded-xl border-none transition-all duration-300 hover:-translate-y-0.5"
              :loading="logging"
              severity="primary"
            >
              <span v-if="!logging">登 录</span>
              <span v-else>登录中...</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="login-footer relative z-1 text-center py-6 text-sm">
      <p>{{ footer }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--p-primary-50) 0%,
    var(--p-surface-0) 50%,
    var(--p-primary-100) 100%
  );
}

.circle-1 {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--p-primary-500) 25%, transparent) 0%,
    color-mix(in srgb, var(--p-primary-500) 10%, transparent) 100%
  );
  animation: float 20s ease-in-out infinite;
}

.circle-2 {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--p-primary-600) 30%, transparent) 0%,
    color-mix(in srgb, var(--p-primary-500) 15%, transparent) 100%
  );
  animation: float 15s ease-in-out infinite reverse;
}

.circle-3 {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--p-primary-400) 20%, transparent) 0%,
    color-mix(in srgb, var(--p-primary-300) 10%, transparent) 100%
  );
  animation: float 18s ease-in-out infinite;
  animation-delay: -5s;
}

.grid-pattern {
  background-image:
    linear-gradient(color-mix(in srgb, var(--p-primary-500) 3%, transparent) 1px, transparent 1px),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--p-primary-500) 3%, transparent) 1px,
      transparent 1px
    );
  background-size: 50px 50px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.05);
  }
}

.logo-img {
  filter: drop-shadow(0 4px 12px color-mix(in srgb, var(--p-primary-500) 30%, transparent));
}

.brand-title {
  background: linear-gradient(135deg, var(--p-primary-500) 0%, var(--p-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  color: var(--text-color);
}

.feature-item {
  color: var(--text-secondary-color);
}

.login-form {
  background: var(--p-surface-0);
  box-shadow:
    0 20px 60px -15px color-mix(in srgb, var(--p-surface-900) 10%, transparent),
    0 8px 30px -10px color-mix(in srgb, var(--p-surface-900) 5%, transparent);
}

.form-title {
  color: var(--text-color);
}

.form-desc {
  color: var(--text-secondary-color);
}

.field-label {
  color: var(--text-color);
}

.captcha-image {
  border: 1px solid var(--p-surface-300);
}

.captcha-image:hover {
  border-color: var(--p-primary-color);
  box-shadow: 0 0 0 3px var(--p-primary-100);
}

.submit-btn {
  background: linear-gradient(135deg, var(--p-primary-500) 0%, var(--p-primary-700) 100%);
}

.submit-btn:hover:not(:disabled) {
  box-shadow: 0 10px 30px -10px var(--p-primary-color);
}

.login-footer {
  color: var(--text-color);
}

@media (max-width: 992px) {
  .brand-title {
    font-size: 2rem;
  }
}
</style>
