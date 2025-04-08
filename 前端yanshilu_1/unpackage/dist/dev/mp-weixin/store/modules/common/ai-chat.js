"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const state = {
  isLoading: false,
  isTesting: false,
  error: null,
  messages: [],
  conversationId: null,
  lastResponse: null,
  testResult: null
};
const getters = {
  isLoading: (state2) => state2.isLoading,
  isTesting: (state2) => state2.isTesting,
  error: (state2) => state2.error,
  messages: (state2) => state2.messages,
  lastResponse: (state2) => state2.lastResponse,
  conversationId: (state2) => state2.conversationId,
  testResult: (state2) => state2.testResult
};
const SET_LOADING = "SET_LOADING";
const SET_TESTING = "SET_TESTING";
const SET_ERROR = "SET_ERROR";
const SET_MESSAGES = "SET_MESSAGES";
const ADD_MESSAGE = "ADD_MESSAGE";
const SET_CONVERSATION_ID = "SET_CONVERSATION_ID";
const SET_LAST_RESPONSE = "SET_LAST_RESPONSE";
const CLEAR_CONVERSATION = "CLEAR_CONVERSATION";
const SET_TEST_RESULT = "SET_TEST_RESULT";
const mutations = {
  [SET_LOADING](state2, status) {
    state2.isLoading = status;
  },
  [SET_TESTING](state2, status) {
    state2.isTesting = status;
  },
  [SET_ERROR](state2, error) {
    state2.error = error;
  },
  [SET_MESSAGES](state2, messages) {
    state2.messages = messages;
  },
  [ADD_MESSAGE](state2, message) {
    state2.messages.push(message);
  },
  [SET_CONVERSATION_ID](state2, id) {
    state2.conversationId = id;
  },
  [SET_LAST_RESPONSE](state2, response) {
    state2.lastResponse = response;
  },
  [CLEAR_CONVERSATION](state2) {
    state2.messages = [];
    state2.conversationId = null;
    state2.lastResponse = null;
  },
  [SET_TEST_RESULT](state2, result) {
    state2.testResult = result;
  }
};
const actions = {
  /**
   * @description 发送聊天消息
   * @param {Object} context - Vuex上下文
   * @param {Object} payload - 请求参数
   * @param {string} payload.message - 消息内容
   * @param {Object} [payload.context] - 上下文信息
   * @returns {Promise<Object>} 发送结果
   */
  async sendChatMessage({ commit, state: state2 }, { message, context = {} }) {
    var _a;
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      const userMessage = {
        id: Date.now().toString(),
        content: message,
        role: "user",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      commit(ADD_MESSAGE, userMessage);
      const requestParams = {
        message,
        conversationId: state2.conversationId,
        context
      };
      const response = await store_services_index.services.aiChat.sendMessage(requestParams);
      if (!response.success) {
        throw new Error(((_a = response.error) == null ? void 0 : _a.message) || "发送消息失败");
      }
      if (response.data.conversationId && !state2.conversationId) {
        commit(SET_CONVERSATION_ID, response.data.conversationId);
      }
      const aiMessage = {
        id: response.data.messageId || `ai-${Date.now()}`,
        content: response.data.content,
        role: "assistant",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      commit(ADD_MESSAGE, aiMessage);
      commit(SET_LAST_RESPONSE, response.data);
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:127", "发送聊天消息失败:", error);
      commit(SET_ERROR, error.message || "发送聊天消息失败");
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: "抱歉，我遇到了一些问题，请稍后再试。",
        role: "assistant",
        isError: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      commit(ADD_MESSAGE, errorMessage);
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  /**
   * @description 获取历史消息
   * @param {Object} context - Vuex上下文
   * @param {string} conversationId - 会话ID
   * @returns {Promise<Object>} 历史消息
   */
  async getConversationHistory({ commit }, conversationId) {
    var _a;
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      const response = await store_services_index.services.aiChat.getMessages(conversationId);
      if (response.success) {
        commit(SET_MESSAGES, response.data.messages || []);
        commit(SET_CONVERSATION_ID, conversationId);
      } else {
        throw new Error(((_a = response.error) == null ? void 0 : _a.message) || "获取历史消息失败");
      }
      return response;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:168", "获取历史消息失败:", error);
      commit(SET_ERROR, error.message || "获取历史消息失败");
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  /**
   * @description 创建新会话
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 创建结果
   */
  async createNewConversation({ commit }) {
    var _a;
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      commit(CLEAR_CONVERSATION);
      const response = await store_services_index.services.aiChat.createConversation();
      if (response.success) {
        commit(SET_CONVERSATION_ID, response.data.conversationId);
      } else {
        throw new Error(((_a = response.error) == null ? void 0 : _a.message) || "创建会话失败");
      }
      return response;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:197", "创建会话失败:", error);
      commit(SET_ERROR, error.message || "创建会话失败");
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  /**
   * @description 清除当前会话
   * @param {Object} context - Vuex上下文
   */
  clearConversation({ commit }) {
    commit(CLEAR_CONVERSATION);
  },
  /**
   * @description 测试AIQA接口
   * @param {Object} context - Vuex上下文
   * @param {string} question - 用户提问
   * @returns {Promise<Object>} 测试结果
   */
  async testAIQA({ commit }, question) {
    try {
      commit(SET_LOADING, true);
      commit(SET_TESTING, true);
      commit(SET_ERROR, null);
      const result = await store_services_index.services.aiChat.testAIQA(question);
      if (result.success) {
        commit(SET_TEST_RESULT, result.data);
      } else {
        commit(SET_ERROR, result.error || { message: "获取AI回复失败" });
      }
      return result;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:235", "测试AIQA失败:", error);
      commit(SET_ERROR, error.message || "测试AIQA失败");
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_TESTING, false);
    }
  },
  /**
   * @description 清除测试结果
   * @param {Object} context - Vuex上下文
   */
  clearTestResult({ commit }) {
    commit(SET_TEST_RESULT, null);
  }
};
const aiChat = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.aiChat = aiChat;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/ai-chat.js.map
