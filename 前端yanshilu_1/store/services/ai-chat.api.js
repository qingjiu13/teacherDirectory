/**
 * @description AI聊天相关API服务
 */
// 删除axios导入，使用uni-app提供的请求API
import { API_BASE_URL, AIQA_TEST_URL } from '../../config';

const API_PREFIX = `${API_BASE_URL}/ai-chat`;

// 错误码和消息映射
const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查您的网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后再试',
  SERVER_ERROR: '服务器错误，请稍后再试',
  AUTH_ERROR: '身份验证失败，请重新登录',
  INVALID_PARAM: '参数错误',
  RATE_LIMIT: '请求过于频繁，请稍后再试',
  UNKNOWN_ERROR: '未知错误，请稍后再试'
};

/**
 * @description 使用uni.request封装网络请求
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url,
      data: options.data,
      method: options.method || 'GET',
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * @description 处理响应错误
 * @param {Object} error - 错误对象
 * @returns {Object} 格式化的错误对象
 */
const handleError = (error) => {
  let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
  
  if (error.statusCode) {
    // 处理HTTP状态码错误
    if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    } else if (error.statusCode === 404) {
      errorMessage = '请求的资源不存在';
    } else if (error.statusCode === 429) {
      errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else if (error.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    }
    
    // 尝试从响应中获取更详细的错误信息
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    }
  } else {
    // 网络错误或其他错误
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return {
    message: errorMessage,
    originalError: error
  };
};

/**
 * @description 获取会话列表
 * @returns {Promise<Object>} 会话列表
 */
export const getConversations = async () => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations`
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取会话列表失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 获取会话消息
 * @param {string} conversationId - 会话ID
 * @returns {Promise<Object>} 会话消息
 */
export const getMessages = async (conversationId) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations/${conversationId}/messages`
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取会话消息失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 发送消息
 * @param {Object} params - 请求参数
 * @param {string} params.message - 消息内容
 * @param {string} [params.conversationId] - 会话ID，不传则创建新会话
 * @param {Object} [params.context] - 上下文信息
 * @returns {Promise<Object>} 消息响应
 */
export const sendMessage = async (params) => {
  try {
    const requestData = {
      message: params.message,
      conversationId: params.conversationId,
      context: params.context || {}
    };
    
    const response = await request({
      url: `${API_PREFIX}/chat`,
      method: 'POST',
      data: requestData
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('发送消息失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 创建新会话
 * @returns {Promise<Object>} 创建结果
 */
export const createConversation = async () => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations`,
      method: 'POST'
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('创建会话失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 删除会话
 * @param {string} conversationId - 会话ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations/${conversationId}`,
      method: 'DELETE'
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('删除会话失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 测试AIQA接口
 * @param {string} question - 用户提问
 * @returns {Promise<Object>} 请求结果
 */
export const testAIQA = async (question) => {
  try {
    const url = `${AIQA_TEST_URL}?question=${encodeURIComponent(question)}`;
    
    const response = await request({
      url: url
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('测试AIQA失败:', error);
    return { success: false, error: handleError(error) };
  }
}; 