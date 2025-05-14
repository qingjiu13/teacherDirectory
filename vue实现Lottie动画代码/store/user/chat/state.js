/**
 * chat模块的状态
 * @module store/user/chat/state
 */

export default {
      // 当前会话状态
  currentSession: {
    sessionId: null,       // 当前会话ID
    sessionType: null,     // 会话类型 (单聊/群聊/客服等)
    targetId: null,        // 对方ID(用户ID或群ID)
    unreadCount: 0,        // 未读消息数
    lastMessage: null,     // 最后一条消息
    isActive: false,       // 是否处于活跃状态(前端是否打开)
    draftMessage: ''       // 草稿消息
  },
  
  // 会话列表
  sessions: {
    // 按sessionId存储的会话对象
    byId: {
      'session1': {
        sessionId: 'session1',
        sessionType: 'private',
        targetId: 'user123',
        title: '王老师',       // 会话标题(可能是备注/群名称)
        avatar: '/static/image/defaultAvatar/teacher-man.png',       // 头像
        lastMessage: {},     // 最后一条消息
        unreadCount: 3,      // 未读数量
        lastMessageTime: 1620000000, // 最后消息时间戳
        isMuted: false,      // 是否静音
        isTop: false,        // 是否置顶
        draft: ''            // 草稿
      }
    },
    // 按时间排序的sessionId数组
    allIds: []
  },
  
  // 消息存储
  messages: {
    // 按sessionId分组存储的消息
    bySessionId: {
      
      'session1': {
        hasMore: true,       // 是否还有更多历史消息
        isLoading: false,     // 是否正在加载
        list: [              // 消息数组(按时间排序)
          {
            id: 'msg1',       // 消息ID
            type: 'text',    // 消息类型(text/image/file等)
            content: '你好，我是王老师，很高兴认识你',   // 消息内容
            senderId: 'user123', // 发送者ID
            senderInfo: {}, // 发送者信息(可选)
            time: 1620000000, // 时间戳
            status: 'sent',   // 状态(sent/delivered/read/failed)
            isSelf: false     // 是否是自己发送的
          }
        ]
      }
    }
  },
  
  // 用户信息缓存(减少重复请求)
  userInfos: {
    
    'user123':  {
      userId: 'user123',
      nickname: '王老师',
      avatar: '/static/image/defaultAvatar/teacher-man.png',
      remark: '王老师'       // 备注名
    }
    
  },
  
  // IM 连接状态
  connection: {
    isConnected: false,    // 是否已连接
    isConnecting: false,   // 是否正在连接中
    lastError: null,       // 最后错误信息
    reconnectCount: 0      // 重连次数
  },
  
  // 其他状态
  uiState: {
    inputFocus: false,     // 输入框是否聚焦
    showEmojiPicker: false, // 是否显示表情选择器
    showMorePanel: false   // 是否显示更多功能面板
  }
}; 