// 从 animal-island-vue 同步主题样式到 src/styles/animal-island.vendor.css。
//
// 适配 CocoBot 专属现代科技风：
// 1. 移除 Noto Sans SC 中文子集字体（中文使用系统高清字体）；
// 2. 颜色映射：将原组件库的泛黄奶油底色与泥土暖棕全面升级为纯净现代科技白与深海蓝（#224294）。

import { createRequire } from 'node:module'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')
const outDir = resolve(webRoot, 'src/styles')
const outFiles = join(outDir, 'files')

const require = createRequire(import.meta.url)
const cssPath = require.resolve('animal-island-vue/style')
const distDir = dirname(cssPath)
const pkgDir = dirname(distDir)
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))

let css = readFileSync(cssPath, 'utf8')

// 1. 移除中文字体 @font-face
const removedFaces = []
css = css.replace(/@font-face\{[^}]*\}/g, (block) => {
  if (/font-family:\s*Noto Sans SC/i.test(block)) {
    removedFaces.push(block)
    return ''
  }
  return block
})

// 2. 复制仍然被引用的字体 / 图片资源
const referenced = new Set()
for (const m of css.matchAll(/url\(\.\/files\/([^)'"]+)\)/g)) referenced.add(m[1])

rmSync(outFiles, { recursive: true, force: true })
mkdirSync(outFiles, { recursive: true })
for (const name of referenced) {
  copyFileSync(join(pkgDir, 'dist/files', name), join(outFiles, name))
}

// 3. 颜色映射：消除泛黄/暖棕泥土色，换成 CocoBot 纯净深海蓝与冷灰白体系
const colorMap = [
  // 主色薄荷绿 -> 深海蓝
  [/19c8b9/gi, '224294'],
  [/3dd4c6/gi, '2e54b6'],
  [/11a89b/gi, '1a3373'],
  [/e6f9f6/gi, 'edf2fc'],
  // 表面/卡片/输入框底色：泛黄奶油 -> 纯白 / Slate-50
  [/fffdf7/gi, 'ffffff'],
  [/f7f3df/gi, 'f8fafc'],
  [/fffbe7/gi, 'ffffff'],
  [/efe5cd/gi, 'f4f6fa'],
  [/f8f8f0/gi, 'f8fafc'],
  [/ece8dc/gi, 'f1f5f9'],
  [/eae5db/gi, 'e2e8f0'],
  [/f5f5f0/gi, 'f8fafc'],
  // 描边线条：泥沙黄 -> 浅石板灰
  [/ece0c9/gi, 'e2e8f0'],
  [/e0d2b6/gi, 'cbd5e1'],
  [/d9cdb4/gi, 'cbd5e1'],
  [/d4c9b4/gi, 'cbd5e1'],
  // 文字：泥土暖棕 -> 石板冷黑/深灰
  [/5f4423/gi, '0f172a'],
  [/725d42/gi, '1e293b'],
  [/8a7b66/gi, '475569'],
  [/9a8b72/gi, '64748b'],
  [/c4b89e/gi, '94a3b8'],
]

for (const [regex, replacement] of colorMap) {
  css = css.replace(regex, replacement)
}

// 4. 输出
const banner = `/* 本文件由 web/scripts/sync-theme.mjs 自动生成，请勿手动修改。
 * 来源：animal-island-vue v${pkg.version}（MIT）
 * 处理：移除 Noto Sans SC 中文子集；颜色全量映射为 CocoBot 现代科技深海蓝与冷灰白体系。
 */
`
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'animal-island.vendor.css'), banner + css, 'utf8')

const files = readdirSync(outFiles)
console.log(`[sync-theme] animal-island-vue v${pkg.version} → src/styles/animal-island.vendor.css（已转换 CocoBot 色彩体系）`)
