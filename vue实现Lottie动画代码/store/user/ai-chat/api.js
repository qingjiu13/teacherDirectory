/**
 * AI聊天相关API
 * @module store/user/ai-chat/api
 */

import { 
  AIQA_QUESTION_URL, 
  AIQA_GET_HISTORY_URL, 
  AIQA_GET_HISTORY_DETAIL_URL, 
  AIQA_DELETE_HISTORY_URL 
} from './constants';

/**
 * 发送问题到AI并获取回答
 * @param {Object} data - 请求数据
 * @param {string} data.question - 用户问题
 * @param {Object} data.contextInfo - 上下文信息
 * @param {string} data.contextInfo.mode - 对话模式
 * @param {string} data.contextInfo.userSchool - 用户学校
 * @param {string} data.contextInfo.userMajor - 用户专业
 * @param {string} data.chatId - 对话ID
 * @param {string} data.userId - 用户ID
 * @returns {Promise<Object>} 返回请求结果
 */
export const questionAI = (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: AIQA_QUESTION_URL,
      method: 'POST',
      data: {
        userId: uni.getStorageSync('userId') || 'guest', // 获取存储的用户ID，如果没有则使用guest
        question: data.question,
        contextInfo: data.contextInfo,
        chatId: data.chatId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          resolve({
            success: true,
            data: res.data.answer,
            chatId: res.data.chatId
          });
        } else {
          reject({
            success: false,
            error: {
              statusCode: res.statusCode,
              message: res.data?.message || '请求失败'
            }
          });
        }
      },
      fail: (err) => {
        reject({
          success: false,
          error: {
            message: err.errMsg || '网络请求失败'
          }
        });
      }
    });
  });
};

/**
 * 中断当前请求
 * @param {AbortController} controller - 请求控制器
 */
export const abortRequest = (requestTask) => {
  if (requestTask && typeof requestTask.abort === 'function') {
    requestTask.abort();
  }
};

/**
 * 获取用户的对话历史记录列表
 * @param {Object} data - 请求数据
 * @param {string} data.userId - 用户ID
 * @returns {Promise<Object>} 返回请求结果，包含对话摘要列表
 */
export const getConversationHistory = (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: AIQA_GET_HISTORY_URL,
      method: 'GET',
      data: {
        userId: data.userId || uni.getStorageSync('userId') || 'guest'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          // 返回的数据包含各个对话的摘要信息：id, abstract, chatMode, createdAt, updatedAt
          resolve({
            success: true,
            data: res.data.conversations || []
          });
        } else {
          reject({
            success: false,
            error: {
              statusCode: res.statusCode,
              message: res.data?.message || '获取历史记录失败'
            }
          });
        }
      },
      fail: (err) => {
        reject({
          success: false,
          error: {
            message: err.errMsg || '网络请求失败'
          }
        });
      }
    });
  });
};

/**
 * 获取特定对话的详细内容
 * @param {Object} data - 请求数据
 * @param {string} data.conversationId - 对话ID
 * @param {string} data.userId - 用户ID（可选，部分后端可能需要验证）
 * @returns {Promise<Object>} 返回请求结果，包含完整的对话内容
 */
export const getConversationDetail = (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: AIQA_GET_HISTORY_DETAIL_URL,
      method: 'GET',
      data: {
        conversationId: data.conversationId,
        userId: data.userId || uni.getStorageSync('userId') || 'guest'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          // 返回的数据包含完整的对话信息，包括messages
          resolve({
            success: true,
            data: {
              id: res.data.id,
              abstract: res.data.abstract,
              chatMode: res.data.chatMode,
              createdAt: res.data.createdAt,
              updatedAt: res.data.updatedAt,
              messages: res.data.messages || []
            }
          });
        } else {
          reject({
            success: false,
            error: {
              statusCode: res.statusCode,
              message: res.data?.message || '获取对话详情失败'
            }
          });
        }
      },
      fail: (err) => {
        reject({
          success: false,
          error: {
            message: err.errMsg || '网络请求失败'
          }
        });
      }
    });
  });
};

/**
 * 删除特定对话历史记录
 * @param {Object} data - 请求数据
 * @param {string} data.conversationId - 需要删除的对话ID
 * @param {string} data.userId - 用户ID（可选）
 * @returns {Promise<Object>} 返回请求结果
 */
export const deleteConversationHistory = (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: AIQA_DELETE_HISTORY_URL,
      method: 'POST',
      data: {
        conversationId: data.conversationId,
        userId: data.userId || uni.getStorageSync('userId') || 'guest'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          resolve({
            success: true,
            data: res.data
          });
        } else {
          reject({
            success: false,
            error: {
              statusCode: res.statusCode,
              message: res.data?.message || '删除对话历史失败'
            }
          });
        }
      },
      fail: (err) => {
        reject({
          success: false,
          error: {
            message: err.errMsg || '网络请求失败'
          }
        });
      }
    });
  });
}; 