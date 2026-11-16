import assert from 'node:assert/strict'
import test from 'node:test'
import { BOT_NAME, senderName, senderTitle } from '../src/utils/messageLog.js'
import { buildMsgLogs } from '../src/mock/synthetic.js'

test('自身消息统一显示 CocoBot，不改写日志昵称或接收方', () => {
  for (const type of ['group', 'friend']) {
    for (const failed of [false, true]) {
      const log = Object.freeze({ type, self: true, nickname: 'Bot', user_id: 'qq:10004', group_id: 'qq:123456', failed })
      assert.equal(senderName(log), 'CocoBot')
      assert.equal(log.nickname, 'Bot')
      assert.equal(log.user_id, 'qq:10004')
    }
  }
})

test('收到的消息保留原昵称与用户 ID 回退', () => {
  const cases = [
    [{ nickname: '星野', user_id: 'qq:10001' }, '星野', '用户 ID：10001'],
    [{ nickname: 'Bot', user_id: 'tg:10001' }, 'Bot', '用户 ID：tg:10001'],
    [{ user_id: 'qq:10001' }, '用户 10001', '用户 ID：10001'],
    [{ user_id: 'fs:ou_demo' }, '用户 fs:ou_demo', '用户 ID：fs:ou_demo'],
    [{ nickname: '匿名用户' }, '匿名用户', '匿名用户'],
    [{}, '未知用户', '未知用户'],
  ]
  for (const [log, name, title] of cases) {
    assert.equal(senderName(log), name)
    assert.equal(senderTitle(log), title)
  }
})

test('自身消息悬浮提示区分群聊目标与私聊接收方，保留非 QQ 平台前缀', () => {
  const cases = [
    [{ type: 'group', group_id: 'qq:123456', user_id: 'qq:10004' }, '发送目标群 ID：123456'],
    [{ type: 'group', group_id: 'dc:123456' }, '发送目标群 ID：dc:123456'],
    [{ type: 'friend', user_id: 'qq:10004' }, '接收方 ID：10004'],
    [{ type: 'friend', user_id: '10004' }, '接收方 ID：10004'],
    [{ type: 'friend', user_id: 'lil:10004' }, '接收方 ID：lil:10004'],
    [{ type: 'friend', user_id: 'tg:10004' }, '接收方 ID：tg:10004'],
    [{ type: 'group', user_id: 'qq:10004' }, BOT_NAME],
    [{ type: 'friend' }, BOT_NAME],
  ]
  for (const [fields, title] of cases) {
    for (const failed of [false, true]) {
      assert.equal(senderTitle({ ...fields, self: true, failed }), title)
    }
  }
})

test('演示数据沿用 CocoBot 名称，并保留失败、私聊与转发媒体示例', () => {
  const logs = buildMsgLogs(Date.parse('2026-11-16T12:00:00+08:00'))
  const selfLogs = logs.filter((log) => log.self)
  assert.ok(selfLogs.length > 0)
  assert.ok(selfLogs.every((log) => log.nickname === BOT_NAME))
  assert.ok(selfLogs.some((log) => log.failed))
  assert.ok(selfLogs.some((log) => log.type === 'friend' && log.user_id))
  assert.ok(selfLogs.some((log) => log.text.includes('[nickname:CocoBot id:')))
  assert.ok(selfLogs.some((log) => log.media?.some((media) => media.in_forward)))
})
