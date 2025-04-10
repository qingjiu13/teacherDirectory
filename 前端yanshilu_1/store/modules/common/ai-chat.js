/**
 * @description AI聊天模块 - 处理AI对话功能（共享模块）
 */
import { services } from '../../services';

// 初始状态
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
  currentChatId: null
};

// Getters
const getters = {
  isLoading: state => state.isLoading,
  isTesting: state => state.isTesting,
  error: state => state.error,
  messages: state => state.messages,
  lastResponse: state => state.lastResponse,
  conversationId: state => state.conversationId,
  testResult: state => state.testResult,
  // 新增历史会话相关getters
  historyChats: state => state.historyChats,
  currentChatId: state => state.currentChatId
};

// 引入常量类型
const SET_LOADING = 'SET_LOADING';
const SET_TESTING = 'SET_TESTING';
const SET_ERROR = 'SET_ERROR';
const SET_MESSAGES = 'SET_MESSAGES';
const ADD_MESSAGE = 'ADD_MESSAGE';
const SET_CONVERSATION_ID = 'SET_CONVERSATION_ID';
const SET_LAST_RESPONSE = 'SET_LAST_RESPONSE';
const CLEAR_CONVERSATION = 'CLEAR_CONVERSATION';
const SET_TEST_RESULT = 'SET_TEST_RESULT';
// 新增历史会话相关常量
const SET_HISTORY_CHATS = 'SET_HISTORY_CHATS';
const ADD_HISTORY_CHAT = 'ADD_HISTORY_CHAT';
const UPDATE_HISTORY_CHAT = 'UPDATE_HISTORY_CHAT';
const REMOVE_HISTORY_CHAT = 'REMOVE_HISTORY_CHAT';
const SET_CURRENT_CHAT_ID = 'SET_CURRENT_CHAT_ID';

// Mutations
const mutations = {
  [SET_LOADING](state, status) {
    state.isLoading = status;
  },
  [SET_TESTING](state, status) {
    state.isTesting = status;
  },
  [SET_ERROR](state, error) {
    state.error = error;
  },
  [SET_MESSAGES](state, messages) {
    state.messages = messages;
  },
  [ADD_MESSAGE](state, message) {
    state.messages.push(message);
  },
  [SET_CONVERSATION_ID](state, id) {
    state.conversationId = id;
  },
  [SET_LAST_RESPONSE](state, response) {
    state.lastResponse = response;
  },
  [CLEAR_CONVERSATION](state) {
    state.messages = [];
    state.conversationId = null;
    state.lastResponse = null;
  },
  [SET_TEST_RESULT](state, result) {
    state.testResult = result;
  },
  // 新增历史会话相关mutations
  [SET_HISTORY_CHATS](state, chats) {
    state.historyChats = chats;
  },
  [ADD_HISTORY_CHAT](state, chat) {
    // 添加到列表前端，最新的对话在最前面
    state.historyChats.unshift(chat);
  },
  [UPDATE_HISTORY_CHAT](state, updatedChat) {
    const index = state.historyChats.findIndex(chat => chat.id === updatedChat.id);
    if (index !== -1) {
      state.historyChats.splice(index, 1, updatedChat);
    }
  },
  [REMOVE_HISTORY_CHAT](state, chatId) {
    state.historyChats = state.historyChats.filter(chat => chat.id !== chatId);
  },
  [SET_CURRENT_CHAT_ID](state, chatId) {
    state.currentChatId = chatId;
  }
};

// Actions
const actions = {
  /**
   * @description 发送聊天消息
   * @param {Object} context - Vuex上下文
   * @param {Object} payload - 请求参数
   * @param {string} payload.message - 消息内容
   * @param {Object} [payload.context] - 上下文信息
   * @returns {Promise<Object>} 发送结果
   */
  async sendChatMessage({ commit, state }, { message, context = {} }) {
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      
      // 添加用户消息到列表
      const userMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date().toISOString()
      };
      commit(ADD_MESSAGE, userMessage);
      
      // 准备请求参数
      const requestParams = {
        message,
        conversationId: state.conversationId,
        context
      };
      
      // 发送请求
      const response = await services.aiChat.sendMessage(requestParams);
      
      if (!response.success) {
        throw response.error || { message: response.message || '发送消息失败' };
      }
      
      // 保存会话ID（如果是新会话）
      if (response.data.conversationId && !state.conversationId) {
        commit(SET_CONVERSATION_ID, response.data.conversationId);
      }
      
      // 添加AI回复到消息列表
      const aiMessage = {
        id: response.data.messageId || `ai-${Date.now()}`,
        content: response.data.content,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      commit(ADD_MESSAGE, aiMessage);
      commit(SET_LAST_RESPONSE, response.data);
      
      return response.data;
    } catch (error) {
      console.error('发送聊天消息失败:', error);
      commit(SET_ERROR, error);
      
      // 添加错误消息
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: error.message || '系统错误',
        role: 'assistant',
        isError: true,
        timestamp: new Date().toISOString()
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
      
      const response = await services.aiChat.getMessages(conversationId);
      
      if (response.success) {
        commit(SET_MESSAGES, response.data.messages || []);
        commit(SET_CONVERSATION_ID, conversationId);
      } else {
        throw response.error || { message: response.message || '获取历史消息失败' };
      }
      
      return response;
    } catch (error) {
      console.error('获取历史消息失败:', error);
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
      
      const response = await services.aiChat.createConversation();
      
      if (response.success) {
        commit(SET_CONVERSATION_ID, response.data.conversationId);
      } else {
        throw response.error || { message: response.message || '创建会话失败' };
      }
      
      return response;
    } catch (error) {
      console.error('创建会话失败:', error);
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
      
      // 如果有会话ID，设置当前会话ID
      if (chatId) {
        commit(SET_CURRENT_CHAT_ID, chatId);
      }
      
      // 调用服务，传递问题和上下文信息
      const result = await services.aiChat.testAIQA(question, contextInfo);
      
      if (result.success) {
        commit(SET_TEST_RESULT, result.data);
      } else {
        commit(SET_ERROR, result.error || { message: result.message || '测试AIQA失败' });
      }
      
      return result;
    } catch (error) {
      console.error('测试AIQA失败:', error);
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
      
      // 默认情况下从本地存储获取
      const localChats = uni.getStorageSync('chat_history') || '[]';
      const chats = JSON.parse(localChats);
      
      // 更新vuex状态
      commit(SET_HISTORY_CHATS, chats);
      
      return { success: true, data: chats };
    } catch (error) {
      console.error('获取历史会话失败:', error);
      return { success: false, error, message: error.message };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  
  /**
   * @description 保存或更新聊天记录
   * @param {Object} context - Vuex上下文
   * @param {Object} chatData - 聊天数据
   * @returns {Promise<Object>} 保存结果
   */
  async saveChat({ commit, state }, chatData) {
    try {
      // 从本地获取所有历史记录
      const localChats = uni.getStorageSync('chat_history') || '[]';
      let chats = JSON.parse(localChats);
      
      // 查找当前聊天是否存在
      const existingIndex = chats.findIndex(chat => chat.id === chatData.id);
      
      if (existingIndex !== -1) {
        // 存在则更新
        chats[existingIndex] = {
          ...chatData,
          updatedAt: new Date()
        };
        commit(UPDATE_HISTORY_CHAT, chats[existingIndex]);
      } else {
        // 不存在则添加
        const newChat = {
          ...chatData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        chats.unshift(newChat);
        commit(ADD_HISTORY_CHAT, newChat);
      }
      
      // 限制最大保存数量
      if (chats.length > 50) {
        chats = chats.slice(0, 50);
      }
      
      // 保存到本地
      uni.setStorageSync('chat_history', JSON.stringify(chats));
      
      return { success: true };
    } catch (error) {
      console.error('保存聊天记录失败:', error);
      return { success: false, error, message: error.message };
    }
  },
  
  /**
   * @description 删除聊天记录
   * @param {Object} context - Vuex上下文
   * @param {string} chatId - 聊天ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteChat({ commit, state }, chatId) {
    try {
      // 从本地获取所有历史记录
      const localChats = uni.getStorageSync('chat_history') || '[]';
      let chats = JSON.parse(localChats);
      
      // 过滤掉要删除的记录
      chats = chats.filter(chat => chat.id !== chatId);
      
      // 更新本地存储
      uni.setStorageSync('chat_history', JSON.stringify(chats));
      
      // 更新Vuex状态
      commit(REMOVE_HISTORY_CHAT, chatId);
      
      // 如果删除的是当前会话，清空当前会话
      if (state.currentChatId === chatId) {
        commit(SET_CURRENT_CHAT_ID, null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('删除聊天记录失败:', error);
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
  async loadChat({ commit, state, dispatch }, chatId) {
    try {
      // 从本地或服务器获取聊天记录
      const localChats = uni.getStorageSync('chat_history') || '[]';
      const chats = JSON.parse(localChats);
      
      const chat = chats.find(c => c.id === chatId);
      if (!chat) {
        throw new Error('找不到指定的会话记录');
      }
      
      // 设置当前会话ID
      commit(SET_CURRENT_CHAT_ID, chatId);
      
      return { success: true, data: chat };
    } catch (error) {
      console.error('加载会话记录失败:', error);
      return { success: false, error, message: error.message };
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 