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
  // 补充按钮/组件库残留的暖棕文字、边框、阴影与奶油悬停底色
  [/794f27/gi, '1e293b'],
  [/3d3428/gi, '0f172a'],
  [/4b3b31/gi, '1e293b'],
  [/5a4530/gi, '334155'],
  [/8b7355/gi, '475569'],
  [/8f734f/gi, '475569'],
  [/796c5a/gi, '475569'],
  [/827157/gi, '64748b'],
  [/807359/gi, '64748b'],
  [/807d75/gi, '64748b'],
  [/9f927d/gi, '64748b'],
  [/9a835a/gi, '64748b'],
  [/bdaea0/gi, 'cbd5e1'],
  [/aaa69d/gi, 'cbd5e1'],
  [/a89878/gi, '94a3b8'],
  [/a09080/gi, '94a3b8'],
  [/d4c4a8/gi, 'cbd5e1'],
  [/d5c3a2/gi, 'cbd5e1'],
  [/d5c8b8/gi, 'cbd5e1'],
  [/e2d6bd/gi, 'cbd5e1'],
  [/dfd9ce/gi, 'e2e8f0'],
  [/e8dcc8/gi, 'e2e8f0'],
  [/e9ddc6/gi, 'e2e8f0'],
  [/e8dec7/gi, 'e2e8f0'],
  [/e8d5bc/gi, 'e2e8f0'],
  [/e8e2d6/gi, 'e2e8f0'],
  [/f0e8d8/gi, 'f1f5f9'],
  [/f0ece2/gi, 'f1f5f9'],
  [/f4f0e4/gi, 'f1f5f9'],
  [/f5f0e0/gi, 'f8fafc'],
  [/f5f0e6/gi, 'f8fafc'],
  [/faf8f2/gi, 'f8fafc'],
  [/fbfaf5/gi, 'ffffff'],
  [/fffdf4/gi, 'ffffff'],
  // 补充残留的薄荷绿激活态与 Loading 条纹
  [/50b9ab/gi, '224294'],
  [/0ec4b6/gi, '224294'],
  [/0ea89c/gi, '1a3373'],
  [/0cc0b5/gi, '224294'],
  [/14b6a8/gi, '224294'],
  [/4de2da/gi, '3b66d4'],
  [/01b0a7/gi, '1a3373'],
  [/7fe0d5/gi, '93b4f5'],
  [/c2ece6/gi, 'dbeafe'],
  [/ecf9f6/gi, 'eff6ff'],
  [/d6f0ea/gi, 'dbeafe'],
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
