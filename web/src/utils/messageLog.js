import { shortId } from './messageText.js'

export const BOT_NAME = 'CocoBot'

// 只覆盖自身消息的展示名称，不改写旧日志或其他用户的昵称。
export function senderName(log = {}) {
  if (log.self) return BOT_NAME
  if (log.nickname) return log.nickname
  if (log.user_id) return '用户 ' + shortId(log.user_id)
  return '未知用户'
}

export function senderTitle(log = {}) {
  if (log.self) {
    // 发出日志的 group_id / user_id 是发送目标，不是机器人自身的 ID。
    const isGroup = log.type === 'group'
    const target = shortId(isGroup ? log.group_id : log.user_id)
    return target ? (isGroup ? '发送目标群 ID：' : '接收方 ID：') + target : BOT_NAME
  }
  const id = shortId(log.user_id)
  return id ? '用户 ID：' + id : senderName(log)
}
