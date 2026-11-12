<template>
  <div class="app-shell relative min-h-screen flex items-center justify-center overflow-hidden select-none p-4">
    <!-- 背景装饰：主题深海蓝 / 柔光斑（页面底色与点阵由全局提供） -->
    <div class="absolute -top-44 -left-44 w-125 h-125 rounded-full bg-[#224294]/10 blur-[110px] pointer-events-none" />
    <div class="absolute -bottom-44 -right-44 w-125 h-125 rounded-full bg-[#3259bd]/12 blur-[110px] pointer-events-none" />

    <!-- 登录卡片：奶油小岛卡片 -->
    <form
      class="login-card relative w-135 max-w-[92vw] rounded-3xl overflow-hidden"
      @submit.prevent="onSubmit"
    >
      <!-- 终端标题栏 -->
      <div class="flex items-center gap-1.5 px-5 py-3.5 bg-black/[0.03] border-b border-black/5" aria-hidden="true">
        <span class="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span class="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span class="w-3 h-3 rounded-full bg-[#28c840]" />
        <span class="ml-3 font-mono text-[11px] text-slate-500">coco@bot: ~/console</span>
      </div>

      <div class="p-7 space-y-6">
        <!-- 品牌标识：精致头像 + 现代高质感大字 + 状态徽章 -->
        <div class="text-center pt-1 pb-1 space-y-3.5">
          <div class="relative inline-block">
            <div class="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#224294]/25 via-[#3259bd]/20 to-purple-500/15 blur-lg opacity-80" />
            <img
              :src="logoUrl"
              @error="onLogoError"
              alt="CocoBot"
              class="relative w-20 h-20 mx-auto rounded-full object-cover shadow-xl ring-4 ring-white"
            />
            <span class="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#34c759] ring-2 ring-white shadow-sm" title="系统正常" />
          </div>

          <div>
            <div class="flex items-center justify-center gap-2">
              <span class="text-3xl font-black tracking-[0.12em] bg-gradient-to-r from-slate-900 via-slate-800 to-[#224294] bg-clip-text text-transparent font-sans">
                COCOBOT
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#224294]/10 text-[#224294] font-mono font-bold tracking-normal border border-[#224294]/20">
                {{ auth.cocobotVersion || 'v1.5.2' }}
              </span>
            </div>
            <div class="text-[11px] text-slate-500 font-medium tracking-[0.25em] uppercase mt-1">
              Console · 控制面板
            </div>
            <div class="mt-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] text-slate-400 bg-black/[0.03] border border-black/[0.05]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#224294]/70" />
                Based on AniaBot {{ auth.frameworkVersion || 'v4.8.1' }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-center text-[11.5px] leading-relaxed text-slate-400">
          初始密码见首次启动时的控制台输出
        </p>

        <!-- 密码输入：奶油 pill 输入框 + 主题焦点圈 -->
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          required
          autofocus
          aria-label="密码"
          class="w-full px-5 py-3 text-sm"
        />

        <p v-if="auth.notice" class="text-xs text-center text-[#34c759]">✓ {{ auth.notice }}</p>
        <p v-if="error" class="text-xs text-center text-[#ff3b30]">✗ {{ error }}</p>

        <Button type="primary" size="large" block html-type="submit" :loading="loading">
          {{ loading ? '登录中…' : '登 录' }}
        </Button>

        <p class="text-center text-[10.5px] tracking-[0.08em] text-slate-300">COCOBOT · CONSOLE</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from 'animal-island-vue'
import { api, auth } from '../api.js'

const fallbackLogo = import.meta.env.BASE_URL + 'logo.webp'
const logoUrl = ref('https://q1.qlogo.cn/g?b=qq&nk=3815687323&s=640')
const onLogoError = (e) => {
  e.target.src = fallbackLogo
}

const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  auth.notice = ''
  loading.value = true
  try {
    await api.login(password.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 奶油小岛登录卡片：2px 暖色描边 + 柔和暖阴影 */
.login-card {
  background: var(--surface);
  border: 2px solid var(--line);
  box-shadow: 0 18px 40px -22px rgb(61 52 40 / 0.45), 0 2px 0 0 rgb(255 255 255 / 0.9) inset;
}

/* 主按钮沿用主题库的像素级 3D 按键形态，配色换成面板主色薄荷青绿 */
.login-card :deep(.animal-btn--primary) {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 5px 0 0 var(--accent-strong);
}
.login-card :deep(.animal-btn--primary:hover:not(:disabled)) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  box-shadow: 0 6px 0 0 var(--accent-strong);
}
.login-card :deep(.animal-btn--primary:active:not(:disabled)) {
  background: var(--accent-strong);
  border-color: var(--accent-strong);
  box-shadow: 0 1px 0 0 var(--accent-strong);
}
</style>
