import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSkills, buildSkillDetail } from '../src/mock/synthetic.js'

test('演示技能列表使用 CocoBot 品牌，保留内置技能 ID 与不可禁用行为', () => {
  const { skills } = buildSkills(new Set(['aniabot', 'daily-news']))
  const skill = skills.find((item) => item.name === 'aniabot')
  assert.ok(skill)
  assert.match(skill.description, /^CocoBot 自身说明书/)
  assert.equal(skill.location, '.builtin/aniabot/SKILL.md')
  assert.equal(skill.builtin, true)
  assert.equal(skill.disabled, false)
  assert.equal(skills.find((item) => item.name === 'daily-news').disabled, true)
})

test('演示说明与参考文件展示 CocoBot，并保留 AniaBot 框架来源', () => {
  const skill = buildSkillDetail('aniabot', new Set(['aniabot']))
  assert.ok(skill)
  assert.match(skill.content, /name: aniabot\n/)
  assert.match(skill.content, /# CocoBot 自身说明书（基于 AniaBot）/)
  assert.match(skill.content, /你跑在 CocoBot 上/)
  assert.doesNotMatch(skill.content, /你跑在 AniaBot 上/)
  assert.equal(skill.disabled, false)
  assert.deepEqual(skill.files.map((file) => file.name), [
    'reference/config.md',
    'reference/panel.md',
    'reference/troubleshooting.md',
  ])
  assert.match(skill.files[0].content, /# CocoBot 配置全景/)
})
