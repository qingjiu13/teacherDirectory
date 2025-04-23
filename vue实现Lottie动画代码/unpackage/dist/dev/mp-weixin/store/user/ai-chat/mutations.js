"use strict";
const mutations = {
  /**
   * 更新对话列表（仅包含摘要、ID和聊天模式）
   * @param {Object} state - Vuex状态对象
   * @param {Array<Object>} conversationsList - 对话列表数据
   * @param {string} conversationsList[].id - 对话ID
   * @param {string} conversationsList[].abstract - 对话摘要
   * @param {string} conversationsList[].chatMode - 对话模式
   */
  UPDATE_CONVERSATIONS_LIST(state, conversationsList) {
    if (Array.isArray(conversationsList)) {
      const simplifiedList = conversationsList.map((conversation) => ({
        id: conversation.id,
        abstract: conversation.abstract,
        chatMode: conversation.chatMode,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }));
      state.aiChat.conversations = simplifiedList;
    }
  },
  /**
   * 根据对话ID更新完整对话内容
   * @param {Object} state - Vuex状态对象
   * @param {Object} conversationData - 完整的对话数据
   * @param {string} conversationData.id - 对话ID
   */
  UPDATE_CONVERSATION_DETAIL(state, conversationData) {
    if (!conversationData || !conversationData.id)
      return;
    const index = state.aiChat.conversations.findIndex(
      (conv) => conv.id === conversationData.id
    );
    if (index !== -1) {
      state.aiChat.conversations[index] = conversationData;
    } else {
      state.aiChat.conversations.push(conversationData);
    }
    state.aiChat.activeConversation = conversationData.id;
  },
  /**
   * 更新当前活跃的对话ID
   * @param {Object} state - Vuex状态对象
   * @param {string|null} conversationId - 对话ID
   */
  UPDATE_CURRENT_CONVERSATION(state, conversationId) {
    state.aiChat.activeConversation = conversationId;
  },
  /**
   * 更新用户选择的聊天模式
   * @param {Object} state - Vuex状态对象
   * @param {string} chatMode - 聊天模式
   */
  UPDATE_CHAT_MODE(state, chatMode) {
    state.aiChat.chatMode = chatMode;
  },
  /**
   * 更新用户信息
   * @param {Object} state - Vuex状态对象
   * @param {Object} userInfo - 用户信息
   * @param {string} userInfo.school - 用户学校
   * @param {string} userInfo.major - 用户专业
   */
  UPDATE_USER_INFO(state, userInfo) {
    state.aiChat.userInfo = {
      ...state.aiChat.userInfo,
      ...userInfo
    };
  },
  /**
   * 从对话列表中删除指定ID的对话
   * @param {Object} state - Vuex状态对象
   * @param {string} conversationId - 对话ID
   */
  DELETE_CONVERSATION(state, conversationId) {
    state.aiChat.conversations = state.aiChat.conversations.filter(
      (conv) => conv.id !== conversationId
    );
    if (state.aiChat.activeConversation === conversationId) {
      state.aiChat.activeConversation = null;
    }
  }
};
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/mutations.js.map
