"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_APIroute_AIchat_api = require("../APIroute/AIchat_api.js");
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
    var _a, _b;
    try {
      const messageData = {
        content: payload.question,
        chatMode: ((_a = payload.contextInfo) == null ? void 0 : _a.mode) || state.aiChat.chatMode,
        conversationId: payload.chatId || state.aiChat.activeConversation
      };
      const response = await store_user_APIroute_AIchat_api.sendMessageToAI(messageData);
      if (response.success) {
        commit("UPDATE_CURRENT_CONVERSATION", response.conversationId);
        const newMessage = {
          id: `msg-${Date.now()}`,
          type: "user",
          content: payload.question,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        const aiResponse = {
          id: `msg-${Date.now() + 1}`,
          type: "ai",
          content: response.aiResponse,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        const currentChat = state.aiChat.conversations.find(
          (conv) => conv.id === response.conversationId
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
            id: response.conversationId,
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
        success: response.success,
        data: response.aiResponse,
        chatId: response.conversationId,
        message: response.message
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:101", "AI问答出错:", error);
      return {
        success: false,
        error: error.error || error,
        message: ((_b = error.error) == null ? void 0 : _b.message) || "请求失败"
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
      const response = await store_user_APIroute_AIchat_api.getConversationDetail(conversationId);
      if (response.success) {
        const conversationData = {
          id: conversationId,
          messages: response.messages,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          // 其他会话详情字段...
        };
        commit("UPDATE_CONVERSATION_DETAIL", conversationData);
      }
      return {
        success: response.success,
        data: response.messages
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:140", "加载对话详情失败:", error);
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
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:187", "保存对话失败:", error);
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
      const response = await store_user_APIroute_AIchat_api.deleteConversation(conversationId);
      if (response.success) {
        commit("DELETE_CONVERSATION", conversationId);
        if (state.aiChat.activeConversation === conversationId) {
          commit("UPDATE_CURRENT_CONVERSATION", null);
        }
      }
      return {
        success: response.success,
        message: response.message || (response.success ? "删除成功" : "删除失败")
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:221", "删除对话失败:", error);
      return {
        success: false,
        error: error.error || error,
        message: ((_a = error.error) == null ? void 0 : _a.message) || "删除对话失败"
      };
    }
  },
  /**
   * 获取对话历史列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 返回请求结果
   */
  async loadConversationHistory({ commit }) {
    var _a;
    try {
      const response = await store_user_APIroute_AIchat_api.getConversationHistory();
      if (response.success && response.conversations) {
        commit("SET_CONVERSATIONS", response.conversations);
      }
      return {
        success: response.success,
        data: response.conversations
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/actions.js:250", "获取对话历史失败:", error);
      return {
        success: false,
        error: error.error || error,
        message: ((_a = error.error) == null ? void 0 : _a.message) || "获取对话历史失败"
      };
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/actions.js.map
