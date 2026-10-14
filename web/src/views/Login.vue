<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden select-none p-4">
    <!-- 背景光斑 + 点阵网格（页面底色由全局浅灰底提供） -->
    <div class="absolute -top-40 -left-40 w-125 h-125 rounded-full bg-[#224294]/10 blur-[120px]" />
    <div class="absolute -bottom-40 -right-40 w-125 h-125 rounded-full bg-[#5ac8fa]/12 blur-[120px]" />
    <div
      class="absolute inset-0 pointer-events-none"
      style="background-image: radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px); background-size: 28px 28px;"
    />

    <!-- 登录卡片：Apple 式浅色磨砂玻璃 -->
    <form
      class="login-glass relative w-135 max-w-[92vw] rounded-2xl overflow-hidden"
      @submit.prevent="onSubmit"
    >
      <!-- 终端标题栏 -->
      <div class="flex items-center gap-1.5 px-4 py-3 bg-black/[0.03] border-b border-black/5" aria-hidden="true">
        <span class="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span class="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span class="w-3 h-3 rounded-full bg-[#28c840]" />
        <span class="ml-3 font-mono text-xs text-slate-500">coco@bot: ~/console</span>
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
                {{ auth.cocobotVersion || 'v1.1.0' }}
              </span>
            </div>
            <div class="text-[11px] text-slate-500 font-medium tracking-[0.25em] uppercase mt-1">
              Console · 控制面板
            </div>
            <div class="mt-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] text-slate-400 bg-black/[0.03] border border-black/[0.05]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#224294]/70" />
                Based on AniaBot {{ auth.frameworkVersion || 'v4.7.8' }}
              </span>
            </div>
          </div>
        </div>

        <div class="h-px bg-black/6" />

        <!-- 模拟启动日志 -->
        <div class="font-mono text-[11px] leading-relaxed space-y-1" aria-hidden="true">
          <p class="text-slate-400"># 初始密码见首次启动时的控制台输出</p>
          <p><span class="text-[#34c759]">[ OK ]</span> <span class="text-slate-500">插件系统就绪</span></p>
          <p><span class="text-[#34c759]">[ OK ]</span> <span class="text-slate-500">Web 控制面板已启动</span></p>
          <p><span class="text-[#ff9f0a]">[ .. ]</span> <span class="text-slate-500">等待管理员认证<span class="cursor-blink">▋</span></span></p>
        </div>

        <!-- 终端提示符式密码输入 -->
        <div class="flex items-center gap-2.5 font-mono">
          <span class="text-[#224294] text-sm select-none" aria-hidden="true">➜</span>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            required
            autofocus
            aria-label="密码"
            class="flex-1 min-w-0 bg-transparent! border-0! border-b! border-black/15! focus:border-[#224294]/70! shadow-none! rounded-none! px-1 py-1.5 text-sm text-[#1d1d1f] placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <p v-if="auth.notice" class="font-mono text-xs text-[#34c759]">✓ {{ auth.notice }}</p>
        <p v-if="error" class="font-mono text-xs text-[#ff3b30]">✗ {{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
        class="w-full py-2.5 btn-accent rounded-xl text-sm"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
/* Apple 式浅色磨砂玻璃登录卡片 */
.login-glass {
  background: linear-gradient(180deg, rgb(255 255 255 / 0.9) 0%, rgb(255 255 255 / 0.78) 100%);
  border: 1px solid rgb(0 0 0 / 0.06);
  box-shadow:
    0 30px 70px -40px rgb(0 0 0 / 0.4),
    0 1px 3px rgb(0 0 0 / 0.06),
    0 2px 0 0 rgb(255 255 255 / 0.6) inset;
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
}

/* 终端光标闪烁 */
.cursor-blink {
  display: inline-block;
  margin-left: 2px;
  animation: cursor-blink 1.1s steps(1) infinite;
}
@keyframes cursor-blink {
  50% {
    opacity: 0;
  }
}
</style>
