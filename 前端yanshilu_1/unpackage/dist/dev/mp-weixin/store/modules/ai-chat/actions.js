"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_aiChat_api = require("../../services/ai-chat.api.js");
const actions = {
  /**
   * @description 获取会话列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 操作结果
   */
  async fetchConversations({ commit }) {
    try {
      commit("SET_LOADING", { conversations: true });
      commit("CLEAR_ERROR");
      const response = await store_services_aiChat_api.getConversations();
      if (response.success) {
        commit("SET_CONVERSATIONS", response.data);
        commit("SET_LOADING", { conversations: false });
        return { success: true, data: response.data };
      } else {
        commit("SET_ERROR", response.message || "获取会话列表失败");
        commit("SET_LOADING", { conversations: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/ai-chat/actions.js:36", "获取会话列表失败:", error);
      commit("SET_ERROR", error.message || "获取会话列表过程中发生错误");
      commit("SET_LOADING", { conversations: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 获取特定会话的消息
   * @param {Object} context - Vuex上下文
   * @param {string} conversationId - 会话ID
   * @returns {Promise<Object>} 操作结果
   */
  async fetchMessages({ commit }, conversationId) {
    try {
      commit("SET_LOADING", { messages: true });
      commit("CLEAR_ERROR");
      commit("SET_CURRENT_CONVERSATION", conversationId);
      const response = await store_services_aiChat_api.getMessages(conversationId);
      if (response.success) {
        commit("SET_MESSAGES", response.data.messages);
        const { title } = response.data;
        commit("UPDATE_CONVERSATION", { id: conversationId, title });
        commit("SET_LOADING", { messages: false });
        return { success: true, data: response.data };
      } else {
        commit("SET_ERROR", response.message || "获取消息失败");
        commit("SET_LOADING", { messages: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/ai-chat/actions.js:74", "获取消息失败:", error);
      commit("SET_ERROR", error.message || "获取消息过程中发生错误");
      commit("SET_LOADING", { messages: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 发送消息
   * @param {Object} context - Vuex上下文
   * @param {Object} messageData - 消息数据
   * @param {string} messageData.content - 消息内容
   * @returns {Promise<Object>} 操作结果
   */
  async sendMessage({ commit, state }, { content }) {
    try {
      if (!state.currentConversationId) {
        const createResult = await this.dispatch("ai-chat/createConversation");
        if (!createResult.success) {
          return createResult;
        }
      }
      commit("SET_LOADING", { sending: true });
      commit("CLEAR_ERROR");
      const userMessage = {
        id: `m${Date.now()}-user`,
        role: "user",
        content,
        timestamp: Date.now()
      };
      commit("ADD_MESSAGE", userMessage);
      const response = await store_services_aiChat_api.sendMessage({
        conversationId: state.currentConversationId,
        content
      });
      if (response.success) {
        commit("ADD_MESSAGE", response.data);
        commit("SET_LOADING", { sending: false });
        return { success: true, data: response.data };
      } else {
        commit("SET_ERROR", response.message || "发送消息失败");
        commit("SET_LOADING", { sending: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/ai-chat/actions.js:128", "发送消息失败:", error);
      commit("SET_ERROR", error.message || "发送消息过程中发生错误");
      commit("SET_LOADING", { sending: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 创建新会话
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 操作结果
   */
  async createConversation({ commit }) {
    try {
      commit("SET_LOADING", { conversations: true });
      commit("CLEAR_ERROR");
      const response = await store_services_aiChat_api.createConversation();
      if (response.success) {
        commit("ADD_CONVERSATION", response.data);
        commit("SET_CURRENT_CONVERSATION", response.data.id);
        commit("SET_MESSAGES", []);
        commit("SET_LOADING", { conversations: false });
        return { success: true, data: response.data };
      } else {
        commit("SET_ERROR", response.message || "创建会话失败");
        commit("SET_LOADING", { conversations: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/ai-chat/actions.js:159", "创建会话失败:", error);
      commit("SET_ERROR", error.message || "创建会话过程中发生错误");
      commit("SET_LOADING", { conversations: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 删除会话
   * @param {Object} context - Vuex上下文
   * @param {string} conversationId - 会话ID
   * @returns {Promise<Object>} 操作结果
   */
  async deleteConversation({ commit }, conversationId) {
    try {
      commit("SET_LOADING", { conversations: true });
      commit("CLEAR_ERROR");
      const response = await store_services_aiChat_api.deleteConversation(conversationId);
      if (response.success) {
        commit("DELETE_CONVERSATION", conversationId);
        commit("SET_LOADING", { conversations: false });
        return { success: true, message: response.message };
      } else {
        commit("SET_ERROR", response.message || "删除会话失败");
        commit("SET_LOADING", { conversations: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/ai-chat/actions.js:189", "删除会话失败:", error);
      commit("SET_ERROR", error.message || "删除会话过程中发生错误");
      commit("SET_LOADING", { conversations: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 更新聊天配置
   * @param {Object} context - Vuex上下文
   * @param {Object} config - 聊天配置
   * @returns {Object} 操作结果
   */
  updateConfig({ commit }, config) {
    try {
      commit("UPDATE_CONFIG", config);
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/ai-chat/actions.js:207", "更新配置失败:", error);
      return { success: false, message: error.message };
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/ai-chat/actions.js.map
