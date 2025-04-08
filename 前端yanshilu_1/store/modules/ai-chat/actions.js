/**
 * @description AI聊天模块的actions
 */

import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  deleteConversation
} from '../../services/ai-chat.api';

export default {
  /**
   * @description 获取会话列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 操作结果
   */
  async fetchConversations({ commit }) {
    try {
      commit('SET_LOADING', { conversations: true });
      commit('CLEAR_ERROR');
      
      const response = await getConversations();
      
      if (response.success) {
        commit('SET_CONVERSATIONS', response.data);
        commit('SET_LOADING', { conversations: false });
        return { success: true, data: response.data };
      } else {
        commit('SET_ERROR', response.message || '获取会话列表失败');
        commit('SET_LOADING', { conversations: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('获取会话列表失败:', error);
      commit('SET_ERROR', error.message || '获取会话列表过程中发生错误');
      commit('SET_LOADING', { conversations: false });
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
      commit('SET_LOADING', { messages: true });
      commit('CLEAR_ERROR');
      
      // 设置当前会话ID
      commit('SET_CURRENT_CONVERSATION', conversationId);
      
      const response = await getMessages(conversationId);
      
      if (response.success) {
        commit('SET_MESSAGES', response.data.messages);
        
        // 更新会话标题
        const { title } = response.data;
        commit('UPDATE_CONVERSATION', { id: conversationId, title });
        
        commit('SET_LOADING', { messages: false });
        return { success: true, data: response.data };
      } else {
        commit('SET_ERROR', response.message || '获取消息失败');
        commit('SET_LOADING', { messages: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('获取消息失败:', error);
      commit('SET_ERROR', error.message || '获取消息过程中发生错误');
      commit('SET_LOADING', { messages: false });
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
      // 确保有当前会话
      if (!state.currentConversationId) {
        // 如果没有当前会话，创建一个新会话
        const createResult = await this.dispatch('ai-chat/createConversation');
        if (!createResult.success) {
          return createResult;
        }
      }
      
      commit('SET_LOADING', { sending: true });
      commit('CLEAR_ERROR');
      
      // 先添加用户消息
      const userMessage = {
        id: `m${Date.now()}-user`,
        role: 'user',
        content,
        timestamp: Date.now()
      };
      commit('ADD_MESSAGE', userMessage);
      
      // 发送到API
      const response = await sendMessage({
        conversationId: state.currentConversationId,
        content
      });
      
      if (response.success) {
        // 添加AI回复
        commit('ADD_MESSAGE', response.data);
        commit('SET_LOADING', { sending: false });
        return { success: true, data: response.data };
      } else {
        commit('SET_ERROR', response.message || '发送消息失败');
        commit('SET_LOADING', { sending: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      commit('SET_ERROR', error.message || '发送消息过程中发生错误');
      commit('SET_LOADING', { sending: false });
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
      commit('SET_LOADING', { conversations: true });
      commit('CLEAR_ERROR');
      
      const response = await createConversation();
      
      if (response.success) {
        commit('ADD_CONVERSATION', response.data);
        commit('SET_CURRENT_CONVERSATION', response.data.id);
        commit('SET_MESSAGES', []);
        commit('SET_LOADING', { conversations: false });
        return { success: true, data: response.data };
      } else {
        commit('SET_ERROR', response.message || '创建会话失败');
        commit('SET_LOADING', { conversations: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('创建会话失败:', error);
      commit('SET_ERROR', error.message || '创建会话过程中发生错误');
      commit('SET_LOADING', { conversations: false });
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
      commit('SET_LOADING', { conversations: true });
      commit('CLEAR_ERROR');
      
      const response = await deleteConversation(conversationId);
      
      if (response.success) {
        commit('DELETE_CONVERSATION', conversationId);
        commit('SET_LOADING', { conversations: false });
        return { success: true, message: response.message };
      } else {
        commit('SET_ERROR', response.message || '删除会话失败');
        commit('SET_LOADING', { conversations: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('删除会话失败:', error);
      commit('SET_ERROR', error.message || '删除会话过程中发生错误');
      commit('SET_LOADING', { conversations: false });
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
      commit('UPDATE_CONFIG', config);
      return { success: true };
    } catch (error) {
      console.error('更新配置失败:', error);
      return { success: false, message: error.message };
    }
  }
};