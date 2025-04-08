/**
 * @description AI聊天模块的mutations
 */

export default {
  /**
   * @description 设置会话列表
   * @param {Object} state - 状态对象
   * @param {Array} conversations - 会话列表
   */
  SET_CONVERSATIONS(state, conversations) {
    state.conversations = conversations;
  },
  
  /**
   * @description 添加新会话
   * @param {Object} state - 状态对象
   * @param {Object} conversation - 会话对象
   */
  ADD_CONVERSATION(state, conversation) {
    state.conversations.unshift(conversation);
  },
  
  /**
   * @description 更新会话
   * @param {Object} state - 状态对象
   * @param {Object} conversation - 会话对象
   */
  UPDATE_CONVERSATION(state, conversation) {
    const index = state.conversations.findIndex(c => c.id === conversation.id);
    if (index !== -1) {
      state.conversations.splice(index, 1, {
        ...state.conversations[index],
        ...conversation
      });
    }
  },
  
  /**
   * @description 删除会话
   * @param {Object} state - 状态对象
   * @param {string} conversationId - 会话ID
   */
  DELETE_CONVERSATION(state, conversationId) {
    state.conversations = state.conversations.filter(c => c.id !== conversationId);
    
    // 如果删除的是当前会话，清空当前会话
    if (state.currentConversationId === conversationId) {
      state.currentConversationId = null;
      state.messages = [];
    }
  },
  
  /**
   * @description 设置当前会话ID
   * @param {Object} state - 状态对象
   * @param {string} conversationId - 会话ID
   */
  SET_CURRENT_CONVERSATION(state, conversationId) {
    state.currentConversationId = conversationId;
  },
  
  /**
   * @description 设置消息列表
   * @param {Object} state - 状态对象
   * @param {Array} messages - 消息列表
   */
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
  
  /**
   * @description 添加消息
   * @param {Object} state - 状态对象
   * @param {Object} message - 消息对象
   */
  ADD_MESSAGE(state, message) {
    state.messages.push(message);
    
    // 如果是当前会话，更新会话的最后一条消息
    if (state.currentConversationId) {
      const conversationIndex = state.conversations.findIndex(c => c.id === state.currentConversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message.content;
        state.conversations[conversationIndex].timestamp = message.timestamp;
      }
    }
  },
  
  /**
   * @description 设置加载状态
   * @param {Object} state - 状态对象
   * @param {Object} loadingState - 加载状态
   * @param {boolean} loadingState.conversations - 会话列表加载状态
   * @param {boolean} loadingState.messages - 消息列表加载状态
   * @param {boolean} loadingState.sending - 发送消息加载状态
   */
  SET_LOADING(state, loadingState) {
    state.loading = {
      ...state.loading,
      ...loadingState
    };
  },
  
  /**
   * @description 设置错误
   * @param {Object} state - 状态对象
   * @param {Object|string|null} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  /**
   * @description 清除错误
   * @param {Object} state - 状态对象
   */
  CLEAR_ERROR(state) {
    state.error = null;
  },
  
  /**
   * @description 更新聊天配置
   * @param {Object} state - 状态对象
   * @param {Object} config - 配置对象
   */
  UPDATE_CONFIG(state, config) {
    state.config = {
      ...state.config,
      ...config
    };
  }
}; 