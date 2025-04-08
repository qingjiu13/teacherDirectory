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
  testResult: null
};

// Getters
const getters = {
  isLoading: state => state.isLoading,
  isTesting: state => state.isTesting,
  error: state => state.error,
  messages: state => state.messages,
  lastResponse: state => state.lastResponse,
  conversationId: state => state.conversationId,
  testResult: state => state.testResult
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
        throw new Error(response.error?.message || '发送消息失败');
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
      commit(SET_ERROR, error.message || '发送聊天消息失败');
      
      // 添加错误消息
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: '抱歉，我遇到了一些问题，请稍后再试。',
        role: 'assistant',
        isError: true,
        timestamp: new Date().toISOString()
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
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      
      const response = await services.aiChat.getMessages(conversationId);
      
      if (response.success) {
        commit(SET_MESSAGES, response.data.messages || []);
        commit(SET_CONVERSATION_ID, conversationId);
      } else {
        throw new Error(response.error?.message || '获取历史消息失败');
      }
      
      return response;
    } catch (error) {
      console.error('获取历史消息失败:', error);
      commit(SET_ERROR, error.message || '获取历史消息失败');
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
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      commit(CLEAR_CONVERSATION);
      
      const response = await services.aiChat.createConversation();
      
      if (response.success) {
        commit(SET_CONVERSATION_ID, response.data.conversationId);
      } else {
        throw new Error(response.error?.message || '创建会话失败');
      }
      
      return response;
    } catch (error) {
      console.error('创建会话失败:', error);
      commit(SET_ERROR, error.message || '创建会话失败');
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
      
      const result = await services.aiChat.testAIQA(question);
      
      if (result.success) {
        commit(SET_TEST_RESULT, result.data);
      } else {
        commit(SET_ERROR, result.error || { message: '获取AI回复失败' });
      }
      
      return result;
    } catch (error) {
      console.error('测试AIQA失败:', error);
      commit(SET_ERROR, error.message || '测试AIQA失败');
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

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 