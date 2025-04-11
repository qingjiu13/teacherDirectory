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
  testResult: null,
  // 新增历史会话管理
  historyChats: [],
  historySummaries: [],
  // 新增：历史会话摘要列表（只包含ID和标题等基本信息）
  currentChatId: null
};
const getters = {
  isLoading: (state2) => state2.isLoading,
  isTesting: (state2) => state2.isTesting,
  error: (state2) => state2.error,
  messages: (state2) => state2.messages,
  lastResponse: (state2) => state2.lastResponse,
  conversationId: (state2) => state2.conversationId,
  testResult: (state2) => state2.testResult,
  // 新增历史会话相关getters
  historyChats: (state2) => state2.historyChats,
  historySummaries: (state2) => state2.historySummaries,
  // 新增：历史会话摘要列表getter
  currentChatId: (state2) => state2.currentChatId
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
const SET_HISTORY_CHATS = "SET_HISTORY_CHATS";
const SET_HISTORY_SUMMARIES = "SET_HISTORY_SUMMARIES";
const ADD_HISTORY_CHAT = "ADD_HISTORY_CHAT";
const UPDATE_HISTORY_CHAT = "UPDATE_HISTORY_CHAT";
const REMOVE_HISTORY_CHAT = "REMOVE_HISTORY_CHAT";
const SET_CURRENT_CHAT_ID = "SET_CURRENT_CHAT_ID";
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
  },
  // 新增历史会话相关mutations
  [SET_HISTORY_CHATS](state2, chats) {
    state2.historyChats = chats;
  },
  [SET_HISTORY_SUMMARIES](state2, summaries) {
    state2.historySummaries = summaries;
  },
  [ADD_HISTORY_CHAT](state2, chat) {
    state2.historyChats.unshift(chat);
  },
  [UPDATE_HISTORY_CHAT](state2, updatedChat) {
    const index = state2.historyChats.findIndex((chat) => chat.id === updatedChat.id);
    if (index !== -1) {
      state2.historyChats.splice(index, 1, updatedChat);
    }
  },
  [REMOVE_HISTORY_CHAT](state2, chatId) {
    state2.historyChats = state2.historyChats.filter((chat) => chat.id !== chatId);
    state2.historySummaries = state2.historySummaries.filter((chat) => chat.id !== chatId);
  },
  [SET_CURRENT_CHAT_ID](state2, chatId) {
    state2.currentChatId = chatId;
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
        throw response.error || { message: response.message || "发送消息失败" };
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
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:166", "发送聊天消息失败:", error);
      commit(SET_ERROR, error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: error.message || "系统错误",
        role: "assistant",
        isError: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      commit(ADD_MESSAGE, errorMessage);
      return { success: false, error, message: error.message };
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
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      const response = await store_services_index.services.aiChat.getMessages(conversationId);
      if (response.success) {
        commit(SET_MESSAGES, response.data.messages || []);
        commit(SET_CONVERSATION_ID, conversationId);
      } else {
        throw response.error || { message: response.message || "获取历史消息失败" };
      }
      return response;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:207", "获取历史消息失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message };
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
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      commit(CLEAR_CONVERSATION);
      const response = await store_services_index.services.aiChat.createConversation();
      if (response.success) {
        commit(SET_CONVERSATION_ID, response.data.conversationId);
      } else {
        throw response.error || { message: response.message || "创建会话失败" };
      }
      return response;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:236", "创建会话失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message };
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
   * @param {Object} payload - 请求参数
   * @param {string} payload.question - 用户提问
   * @param {Object} payload.contextInfo - 用户上下文信息
   * @param {string} [payload.chatId] - 聊天会话ID
   * @returns {Promise<Object>} 测试结果
   */
  async testAIQA({ commit, dispatch }, { question, contextInfo = {}, chatId = null }) {
    try {
      commit(SET_LOADING, true);
      commit(SET_TESTING, true);
      commit(SET_ERROR, null);
      if (chatId) {
        commit(SET_CURRENT_CHAT_ID, chatId);
      }
      const result = await store_services_index.services.aiChat.testAIQA(question, contextInfo);
      if (result.success) {
        commit(SET_TEST_RESULT, result.data);
      } else {
        commit(SET_ERROR, result.error || { message: result.message || "测试AIQA失败" });
      }
      return result;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:283", "测试AIQA失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message };
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
  },
  /**
   * @description 获取历史会话列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 历史会话
   */
  async getHistoryChats({ commit }) {
    try {
      commit(SET_LOADING, true);
      const response = await store_services_index.services.aiChat.getConversationSummaries();
      if (response.success) {
        commit(SET_HISTORY_SUMMARIES, response.data.summaries || []);
        return { success: true, data: response.data.summaries };
      } else {
        const localChats = common_vendor.index.getStorageSync("chat_history") || "[]";
        const chats = JSON.parse(localChats);
        const summaries = chats.map((chat) => ({
          id: chat.id,
          title: chat.title || "新对话",
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }));
        commit(SET_HISTORY_SUMMARIES, summaries);
        return { success: true, data: summaries };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:333", "获取历史会话失败:", error);
      return { success: false, error, message: error.message };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  /**
   * @description 保存或更新聊天记录摘要
   * @param {Object} context - Vuex上下文
   * @param {Object} chatData - 聊天数据
   * @returns {Promise<Object>} 保存结果
   */
  async saveChat({ commit, state: state2 }, chatData) {
    try {
      try {
        await store_services_index.services.aiChat.saveConversation({
          id: chatData.id,
          title: chatData.title || "新对话",
          messages: state2.messages,
          // 保存完整的消息内容到后端
          createdAt: chatData.createdAt || /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      } catch (apiError) {
        common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:359", "保存对话到后端失败，将使用本地存储", apiError);
      }
      const localSummaries = common_vendor.index.getStorageSync("chat_summaries") || "[]";
      let summaries = JSON.parse(localSummaries);
      const existingIndex = summaries.findIndex((chat) => chat.id === chatData.id);
      if (existingIndex !== -1) {
        summaries[existingIndex] = {
          id: chatData.id,
          title: chatData.title || "新对话",
          createdAt: chatData.createdAt || /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        commit(UPDATE_HISTORY_CHAT, summaries[existingIndex]);
      } else {
        summaries.unshift({
          id: chatData.id,
          title: chatData.title || "新对话",
          createdAt: chatData.createdAt || /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
        commit(ADD_HISTORY_CHAT, {
          id: chatData.id,
          title: chatData.title || "新对话",
          createdAt: chatData.createdAt || /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      if (summaries.length > 50) {
        summaries = summaries.slice(0, 50);
      }
      common_vendor.index.setStorageSync("chat_summaries", JSON.stringify(summaries));
      commit(SET_HISTORY_SUMMARIES, summaries);
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:407", "保存聊天摘要失败:", error);
      return { success: false, error, message: error.message };
    }
  },
  /**
   * @description 删除聊天记录
   * @param {Object} context - Vuex上下文
   * @param {string} chatId - 聊天ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteChat({ commit, state: state2 }, chatId) {
    try {
      if (!chatId) {
        common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:421", "删除聊天记录失败: 缺少chatId参数");
        return { success: false, message: "删除失败：没有指定要删除的聊天ID" };
      }
      common_vendor.index.__f__("log", "at store/modules/common/ai-chat.js:425", "正在删除聊天记录:", chatId);
      try {
        await store_services_index.services.aiChat.deleteConversation(chatId);
      } catch (apiError) {
        common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:432", "从后端删除对话失败，将仅删除本地记录", apiError);
      }
      const localSummaries = common_vendor.index.getStorageSync("chat_summaries") || "[]";
      let summaries = JSON.parse(localSummaries);
      const originalLength = summaries.length;
      summaries = summaries.filter((chat) => chat.id !== chatId);
      if (summaries.length === originalLength) {
        common_vendor.index.__f__("warn", "at store/modules/common/ai-chat.js:445", "未找到要删除的记录ID:", chatId);
      } else {
        common_vendor.index.__f__("log", "at store/modules/common/ai-chat.js:447", `成功从${originalLength}条记录中删除1条记录，剩余${summaries.length}条`);
      }
      common_vendor.index.setStorageSync("chat_summaries", JSON.stringify(summaries));
      commit(REMOVE_HISTORY_CHAT, chatId);
      if (state2.currentChatId === chatId) {
        commit(SET_CURRENT_CHAT_ID, null);
        commit(CLEAR_CONVERSATION);
      }
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:464", "删除聊天记录失败:", error);
      return { success: false, error, message: error.message };
    }
  },
  /**
   * @description 设置当前会话
   * @param {Object} context - Vuex上下文
   * @param {string} chatId - 聊天ID
   */
  setCurrentChat({ commit }, chatId) {
    commit(SET_CURRENT_CHAT_ID, chatId);
  },
  /**
   * @description 加载指定会话
   * @param {Object} context - Vuex上下文
   * @param {string} chatId - 聊天ID
   * @returns {Promise<Object>} 会话数据
   */
  async loadChat({ commit, state: state2, dispatch }, chatId) {
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      commit(SET_CURRENT_CHAT_ID, chatId);
      const response = await store_services_index.services.aiChat.getMessages(chatId);
      if (response.success) {
        commit(SET_MESSAGES, response.data.messages || []);
        commit(SET_CONVERSATION_ID, chatId);
        return { success: true, data: response.data };
      } else {
        const localChats = common_vendor.index.getStorageSync("chat_history") || "[]";
        const chats = JSON.parse(localChats);
        const chat = chats.find((c) => c.id === chatId);
        if (!chat) {
          throw new Error("找不到指定的会话记录");
        }
        commit(SET_MESSAGES, chat.messages || []);
        return { success: true, data: chat };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/ai-chat.js:516", "加载会话记录失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message };
    } finally {
      commit(SET_LOADING, false);
    }
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
