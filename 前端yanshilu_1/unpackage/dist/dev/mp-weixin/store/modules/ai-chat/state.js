"use strict";
const state = {
  // 会话列表
  conversations: [],
  // 当前选中的会话ID
  currentConversationId: null,
  // 当前会话的消息
  messages: [],
  // 加载状态
  loading: {
    conversations: false,
    messages: false,
    sending: false
  },
  // 错误状态
  error: null,
  // 聊天配置
  config: {
    model: "gpt-3.5-turbo",
    // 使用的模型
    temperature: 0.7,
    // 创造性程度 (0-1)
    maxTokens: 2e3,
    // 最大令牌数
    stream: true
    // 是否流式输出
  }
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/ai-chat/state.js.map
