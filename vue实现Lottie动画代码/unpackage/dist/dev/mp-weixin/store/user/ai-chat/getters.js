"use strict";
const getters = {
  /**
   * 获取历史会话摘要列表
   * @param {Object} state - 状态对象
   * @returns {Array<Object>} 历史会话摘要列表
   */
  historySummaries(state) {
    return state.aiChat.conversations.map((conversation) => ({
      id: conversation.id,
      abstract: conversation.abstract,
      chatMode: conversation.chatMode,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    }));
  },
  /**
   * 获取完整的历史会话列表
   * @param {Object} state - 状态对象
   * @returns {Array<Object>} 完整的历史会话列表
   */
  historyChats(state) {
    return state.aiChat.conversations;
  },
  /**
   * 获取当前活跃对话ID
   * @param {Object} state - 状态对象
   * @returns {string|null} 当前活跃对话ID
   */
  currentChatId(state) {
    return state.aiChat.activeConversation;
  },
  /**
   * 获取当前活跃对话内容
   * @param {Object} state - 状态对象
   * @returns {Object|null} 当前活跃对话内容
   */
  currentChat(state) {
    if (!state.aiChat.activeConversation)
      return null;
    return state.aiChat.conversations.find(
      (conv) => conv.id === state.aiChat.activeConversation
    ) || null;
  },
  /**
   * 获取当前聊天模式
   * @param {Object} state - 状态对象
   * @returns {string} 当前聊天模式
   */
  currentChatMode(state) {
    return state.aiChat.chatMode;
  },
  /**
   * 获取用户信息
   * @param {Object} state - 状态对象
   * @returns {Object} 用户信息
   */
  userInfo(state) {
    return state.aiChat.userInfo;
  }
};
exports.getters = getters;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/getters.js.map
