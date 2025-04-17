/**
 * @description AI聊天模块的初始状态
 */

export default {
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
    model: 'gpt-3.5-turbo', // 使用的模型
    temperature: 0.7,        // 创造性程度 (0-1)
    maxTokens: 2000,         // 最大令牌数
    stream: true,            // 是否流式输出
  }
};