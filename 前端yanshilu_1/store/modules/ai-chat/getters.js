/**
 * @description AI聊天模块的getters
 */

export default {
  /**
   * @description 获取会话列表
   * @param {Object} state - 状态对象
   * @returns {Array} 会话列表
   */
  conversations: state => state.conversations,
  
  /**
   * @description 获取当前会话ID
   * @param {Object} state - 状态对象
   * @returns {string|null} 当前会话ID
   */
  currentConversationId: state => state.currentConversationId,
  
  /**
   * @description 获取当前会话
   * @param {Object} state - 状态对象
   * @returns {Object|null} 当前会话
   */
  currentConversation: state => {
    if (!state.currentConversationId) return null;
    return state.conversations.find(c => c.id === state.currentConversationId) || null;
  },
  
  /**
   * @description 获取当前会话的消息
   * @param {Object} state - 状态对象
   * @returns {Array} 消息列表
   */
  messages: state => state.messages,
  
  /**
   * @description 获取加载状态
   * @param {Object} state - 状态对象
   * @returns {Object} 加载状态
   */
  loading: state => state.loading,
  
  /**
   * @description 获取是否正在加载会话
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否加载中
   */
  isLoadingConversations: state => state.loading.conversations,
  
  /**
   * @description 获取是否正在加载消息
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否加载中
   */
  isLoadingMessages: state => state.loading.messages,
  
  /**
   * @description 获取是否正在发送消息
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否发送中
   */
  isSending: state => state.loading.sending,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - 状态对象
   * @returns {Object|string|null} 错误信息
   */
  error: state => state.error,
  
  /**
   * @description 获取聊天配置
   * @param {Object} state - 状态对象
   * @returns {Object} 聊天配置
   */
  config: state => state.config
};