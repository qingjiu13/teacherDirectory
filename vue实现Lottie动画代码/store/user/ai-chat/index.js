/**
 * ai-chat模块的入口文件
 * @module store/user/ai-chat
 */

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import * as constants from './constants';
import { mockApiResponse } from './mock-data';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export { constants };

/**
 * 保存聊天会话摘要
 */
actions.saveChat = ({ commit, state }, chatData) => {
  return new Promise((resolve) => {
    try {
      // 创建/更新会话记录
      let chats = [...state.historyChats];
      const existingChatIndex = chats.findIndex(chat => chat.id === chatData.id);
      
      if (existingChatIndex >= 0) {
        // 更新现有会话
        chats[existingChatIndex] = {
          ...chats[existingChatIndex],
          title: chatData.title,
          abstract: chatData.abstract || chatData.title, // 确保abstract字段存在
          updatedAt: new Date()
        };
      } else {
        // 添加新会话
        chats.unshift({
          id: chatData.id,
          title: chatData.title,
          abstract: chatData.abstract || chatData.title, // 确保abstract字段存在
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      commit('setHistoryChats', chats);
      
      // 模拟API请求
      setTimeout(() => {
        resolve(mockApiResponse(true, { success: true }));
      }, 100);
    } catch (error) {
      console.error('保存聊天摘要失败:', error);
      resolve(mockApiResponse(false, null, { message: '保存聊天摘要失败' }));
    }
  });
}; 