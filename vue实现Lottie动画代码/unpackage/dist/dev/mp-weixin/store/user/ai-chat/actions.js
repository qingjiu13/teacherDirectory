"use strict";
const common_vendor = require("../../../common/vendor.js");
const { questionAI, getConversationHistory, getConversationDetail, deleteConversationHistory } = {
  // 这里可以替换为真实API实现
  questionAI: (params) => Promise.resolve({ success: true, data: "", chatId: params.chatId || "new-chat-id" }),
  getConversationHistory: () => Promise.resolve({ success: true, data: [] }),
  getConversationDetail: (params) => Promise.resolve({ success: true, data: { id: params.conversationId, messages: [] } }),
  deleteConversationHistory: () => Promise.resolve({ success: true })
};
const actions = {
  /**
   * 设置当前活跃的聊天会话
   * @param {Object} context - Vuex上下文
   * @param {string} chatId - 聊天会话ID
   */
  setCurrentChat({ commit }, chatId) {
    commit("UPDATE_CURRENT_CONVERSATION", chatId);
  },
  /**
   * 发送问题到AI并获取回答
   * @param {Object} context - Vuex上下文
   * @param {Object} payload - 请求数据
   * @param {string} payload.question - 用户问题
   * @param {Object} payload.contextInfo - 上下文信息
   * @param {string} payload.chatId - 对话ID
   * @returns {Promise<Object>} 返回请求结果
   */
  async sendQuestion({ commit, state }, payload) {
    var _a;
    try {
      const contextInfo = payload.contextInfo || {
        mode: state.aiChat.chatMode,
        userSchool: state.aiChat.userInfo.school,
        userMajor: state.aiChat.userInfo.major
      };
      const response = await questionAI({
        question: payload.question,
        contextInfo,
        chatId: payload.chatId || state.aiChat.activeConversation
      });
      if (response.success && response.chatId) {
        commit("UPDATE_CURRENT_CONVERSATION", response.chatId);
        const newMessage = {
          id: `msg-${Date.now()}`,
          type: "user",
          content: payload.question,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        const aiResponse = {
          id: `msg-${Date.now() + 1}`,
          type: "ai",
          content: response.data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        const currentChat = state.aiChat.conversations.find(
          (conv) => conv.id === response.chatId
        );
        if (currentChat) {
          const updatedChat = {
            ...currentChat,
            messages: [...currentChat.messages || [], newMessage, aiResponse],
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          commit("UPDATE_CONVERSATION_DETAIL", updatedChat);
        } else {
          const newChat = {
            id: response.chatId,
            abstract: payload.question.substring(0, 30) + (payload.question.length > 30 ? "..." : ""),
            chatMode: state.aiChat.chatMode,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
            messages: [newMessage, aiResponse]
          };
          commit("UPDATE_CONVERSATION_DETAIL", newChat);
        }
      }
      return {
        success: true,
        data: response.data,
        chatId: response.chatId
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:103", "AI问答出错:", error);
      return {
        success: false,
        error: error.error || error,
        message: ((_a = error.error) == null ? void 0 : _a.message) || "请求失败"
      };
    }
  },
  /**
   * 获取用户的对话历史记录列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 返回请求结果
   */
  async getHistoryChats({ commit }) {
    var _a;
    try {
      const response = await getConversationHistory({});
      if (response.success) {
        commit("UPDATE_CONVERSATIONS_LIST", response.data);
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:131", "获取历史记录失败:", error);
      return {
        success: false,
        error: error.error || error,
        message: ((_a = error.error) == null ? void 0 : _a.message) || "获取历史记录失败"
      };
    }
  },
  /**
   * 加载特定对话的完整内容
   * @param {Object} context - Vuex上下文
   * @param {string} conversationId - 对话ID
   * @returns {Promise<Object>} 返回请求结果
   */
  async loadChat({ commit }, conversationId) {
    var _a;
    try {
      const response = await getConversationDetail({
        conversationId
      });
      if (response.success) {
        commit("UPDATE_CONVERSATION_DETAIL", response.data);
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:162", "加载对话详情失败:", error);
      return {
        success: false,
        error: error.error || error,
        message: ((_a = error.error) == null ? void 0 : _a.message) || "加载对话详情失败"
      };
    }
  },
  /**
   * 保存新的对话或更新现有对话
   * @param {Object} context - Vuex上下文
   * @param {Object} chatData - 对话数据
   * @returns {Promise<Object>} 返回操作结果
   */
  async saveChat({ commit, state }, chatData) {
    var _a, _b;
    try {
      const existingConversation = state.aiChat.conversations.find(
        (conv) => conv.id === chatData.id
      );
      if (existingConversation) {
        commit("UPDATE_CONVERSATION_DETAIL", {
          ...existingConversation,
          ...chatData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } else {
        const newConversation = {
          id: chatData.id,
          abstract: chatData.title || "新对话",
          chatMode: chatData.chatMode || "general",
          createdAt: ((_a = chatData.createdAt) == null ? void 0 : _a.toISOString()) || (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: ((_b = chatData.updatedAt) == null ? void 0 : _b.toISOString()) || (/* @__PURE__ */ new Date()).toISOString(),
          messages: chatData.messages || []
        };
        commit("UPDATE_CONVERSATION_DETAIL", newConversation);
      }
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:209", "保存对话失败:", error);
      return {
        success: false,
        message: "保存对话失败"
      };
    }
  },
  /**
   * 删除指定的对话
   * @param {Object} context - Vuex上下文
   * @param {string} conversationId - 对话ID
   * @returns {Promise<Object>} 返回操作结果
   */
  async deleteChat({ commit, state }, conversationId) {
    var _a;
    try {
      const response = await deleteConversationHistory({
        conversationId
      });
      if (response.success) {
        commit("DELETE_CONVERSATION", conversationId);
        if (state.aiChat.activeConversation === conversationId) {
          commit("UPDATE_CURRENT_CONVERSATION", null);
        }
      }
      return {
        success: response.success,
        message: response.success ? "删除成功" : "删除失败"
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:245", "删除对话失败:", error);
      return {
        success: false,
        error: error.error || error,
        message: ((_a = error.error) == null ? void 0 : _a.message) || "删除对话失败"
      };
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/actions.js.map
