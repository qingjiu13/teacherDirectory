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
  historySummaries: [], // 新增：历史会话摘要列表（只包含ID和标题等基本信息）
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
  historySummaries: state => state.historySummaries, // 新增：历史会话摘要列表getter
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
const SET_HISTORY_SUMMARIES = 'SET_HISTORY_SUMMARIES'; // 新增：设置历史摘要常量
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
  [SET_HISTORY_SUMMARIES](state, summaries) { // 新增：设置历史摘要的mutation
    state.historySummaries = summaries;
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
    state.historySummaries = state.historySummaries.filter(chat => chat.id !== chatId);
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
        // 使用后端返回的错误信息
        const errorMsg = response.error?.message || response.message || '发送消息失败';
        throw new Error(errorMsg);
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
      
      // 保存错误信息
      commit(SET_ERROR, {
        message: error.message || '系统错误',
        timestamp: new Date().toISOString(),
        details: error
      });
      
      // 添加错误消息
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: error.message || '系统错误，请稍后再试',
        role: 'assistant',
        isError: true,
        timestamp: new Date().toISOString()
      };
      commit(ADD_MESSAGE, errorMessage);
      
      return { 
        success: false, 
        error: error, 
        message: error.message || '系统错误' 
      };
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
        return result;
      } else {
        // 使用后端返回的错误信息
        const errorMsg = result.error?.message || result.message || '测试AIQA失败';
        commit(SET_ERROR, {
          message: errorMsg,
          timestamp: new Date().toISOString(),
          details: result.error || result
        });
        return { success: false, message: errorMsg, error: result.error };
      }
    } catch (error) {
      console.error('测试AIQA失败:', error);
      commit(SET_ERROR, {
        message: error.message || '系统错误',
        timestamp: new Date().toISOString(),
        details: error
      });
      return { success: false, error, message: error.message || '测试AIQA时发生错误' };
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
      
      // 尝试从后端获取历史会话摘要
      const response = await services.aiChat.getConversationSummaries();
      
      if (response.success) {
        // 如果成功，则更新历史摘要状态
        commit(SET_HISTORY_SUMMARIES, response.data.summaries || []);
        return { success: true, data: response.data.summaries };
      } else {
        // 如果后端API不可用，从本地存储中获取
        const localChats = uni.getStorageSync('chat_history') || '[]';
        const chats = JSON.parse(localChats);
        
        // 从完整历史记录中提取摘要信息
        const summaries = chats.map(chat => ({
          id: chat.id,
          title: chat.title || '新对话',
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }));
        
        commit(SET_HISTORY_SUMMARIES, summaries);
        return { success: true, data: summaries };
      }
    } catch (error) {
      console.error('获取历史会话失败:', error);
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
  async saveChat({ commit, state }, chatData) {
    try {
      // 尝试调用后端API保存完整对话内容
      try {
        // 如果后端API可用，则调用API保存完整对话
        await services.aiChat.saveConversation({
          id: chatData.id,
          title: chatData.title || '新对话',
          messages: state.messages, // 保存完整的消息内容到后端
          createdAt: chatData.createdAt || new Date(),
          updatedAt: new Date()
        });
      } catch (apiError) {
        console.error('保存对话到后端失败，将使用本地存储', apiError);
      }
      
      // 从本地获取所有历史摘要
      const localSummaries = uni.getStorageSync('chat_summaries') || '[]';
      let summaries = JSON.parse(localSummaries);
      
      // 查找当前聊天是否存在
      const existingIndex = summaries.findIndex(chat => chat.id === chatData.id);
      
      if (existingIndex !== -1) {
        // 存在则更新摘要
        summaries[existingIndex] = {
          id: chatData.id,
          title: chatData.title || '新对话',
          createdAt: chatData.createdAt || new Date(),
          updatedAt: new Date()
        };
        commit(UPDATE_HISTORY_CHAT, summaries[existingIndex]);
      } else {
        // 不存在则添加摘要
        summaries.unshift({
          id: chatData.id,
          title: chatData.title || '新对话',
          createdAt: chatData.createdAt || new Date(),
          updatedAt: new Date()
        });
        commit(ADD_HISTORY_CHAT, {
          id: chatData.id,
          title: chatData.title || '新对话',
          createdAt: chatData.createdAt || new Date(),
          updatedAt: new Date()
        });
      }
      
      // 限制最大保存数量
      if (summaries.length > 50) {
        summaries = summaries.slice(0, 50);
      }
      
      // 保存摘要到本地
      uni.setStorageSync('chat_summaries', JSON.stringify(summaries));
      
      // 同时更新Vuex中的历史摘要
      commit(SET_HISTORY_SUMMARIES, summaries);
      
      return { success: true };
    } catch (error) {
      console.error('保存聊天摘要失败:', error);
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
      if (!chatId) {
        console.error('删除聊天记录失败: 缺少chatId参数');
        return { success: false, message: '删除失败：没有指定要删除的聊天ID' };
      }
      
      console.log('正在删除聊天记录:', chatId);
      
      // 尝试调用后端API删除对话
      try {
        // 如果后端API可用，则调用删除API
        await services.aiChat.deleteConversation(chatId);
      } catch (apiError) {
        console.error('从后端删除对话失败，将仅删除本地记录', apiError);
      }
      
      // 从本地获取所有历史摘要
      const localSummaries = uni.getStorageSync('chat_summaries') || '[]';
      let summaries = JSON.parse(localSummaries);
      
      // 过滤掉要删除的记录
      const originalLength = summaries.length;
      summaries = summaries.filter(chat => chat.id !== chatId);
      
      // 检查是否真的删除了记录
      if (summaries.length === originalLength) {
        console.warn('未找到要删除的记录ID:', chatId);
      } else {
        console.log(`成功从${originalLength}条记录中删除1条记录，剩余${summaries.length}条`);
      }
      
      // 更新本地存储
      uni.setStorageSync('chat_summaries', JSON.stringify(summaries));
      
      // 更新Vuex状态
      commit(REMOVE_HISTORY_CHAT, chatId);
      
      // 如果删除的是当前会话，清空当前会话
      if (state.currentChatId === chatId) {
        commit(SET_CURRENT_CHAT_ID, null);
        commit(CLEAR_CONVERSATION);
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
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      
      // 设置当前会话ID
      commit(SET_CURRENT_CHAT_ID, chatId);
      
      // 从后端获取完整会话内容
      const response = await services.aiChat.getMessages(chatId);
      
      if (response.success) {
        // 设置会话消息
        commit(SET_MESSAGES, response.data.messages || []);
        commit(SET_CONVERSATION_ID, chatId);
        return { success: true, data: response.data };
      } else {
        // 如果后端API失败，尝试从本地获取
        const localChats = uni.getStorageSync('chat_history') || '[]';
        const chats = JSON.parse(localChats);
        
        const chat = chats.find(c => c.id === chatId);
        if (!chat) {
          throw new Error('找不到指定的会话记录');
        }
        
        // 设置会话消息
        commit(SET_MESSAGES, chat.messages || []);
        
        return { success: true, data: chat };
      }
    } catch (error) {
      console.error('加载会话记录失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message };
    } finally {
      commit(SET_LOADING, false);
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