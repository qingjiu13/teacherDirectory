/**
 * @description AI聊天相关API服务
 */
import { API_BASE_URL, AIQA_TEST_URL } from '../../config';
// 导入模拟数据用于开发调试
import { mockDelay, mockChatSummaries, mockChatDetails, mockApiResponse } from './mock-data';

const API_PREFIX = `${API_BASE_URL}/ai-chat`;

// 是否使用模拟数据（开发时设为true，调试完成后改为false）
const USE_MOCK_DATA = true;

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
  let errorMessage = '';
  
  // 优先使用后端返回的错误消息
  if (error.data && error.data.message) {
    errorMessage = error.data.message;
  } else if (error.data && error.data.error && error.data.error.message) {
    errorMessage = error.data.error.message;
  } else if (error.statusCode) {
    // 如果没有具体错误消息，根据HTTP状态码判断
    if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    } else if (error.statusCode === 404) {
      errorMessage = '请求的资源不存在';
    } else if (error.statusCode === 429) {
      errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else if (error.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    } else {
      errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  } else {
    // 网络错误或其他错误
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return {
    message: errorMessage,
    originalError: error,
    statusCode: error.statusCode || 0
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
 * @description 获取会话摘要列表（只返回ID和摘要信息，不包含完整消息）
 * @returns {Promise<Object>} 会话摘要列表
 */
export const getConversationSummaries = async () => {
  // 使用模拟数据进行调试
  if (USE_MOCK_DATA) {
    // 添加模拟延迟，模拟网络请求
    await mockDelay(500);
    console.log('使用模拟数据: getConversationSummaries');
    return mockApiResponse({
      summaries: mockChatSummaries
    });
  }
  
  // 正常的API请求
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations/summaries`
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取会话摘要列表失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 获取会话消息
 * @param {string} conversationId - 会话ID
 * @returns {Promise<Object>} 会话消息
 */
export const getMessages = async (conversationId) => {
  // 使用模拟数据进行调试
  if (USE_MOCK_DATA) {
    // 添加模拟延迟，模拟网络请求
    await mockDelay(800);
    console.log('使用模拟数据: getMessages, conversationId =', conversationId);
    
    // 如果找到对应ID的模拟对话数据，返回它
    if (mockChatDetails[conversationId]) {
      return mockApiResponse(mockChatDetails[conversationId]);
    }
    
    // 如果找不到，返回错误
    return { 
      success: false, 
      error: handleError({ 
        statusCode: 404, 
        message: '找不到指定的会话记录' 
      }) 
    };
  }
  
  // 正常的API请求
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
  // 使用模拟数据进行调试
  if (USE_MOCK_DATA) {
    // 添加模拟延迟，模拟网络请求
    await mockDelay(300);
    console.log('使用模拟数据: deleteConversation, conversationId =', conversationId);
    return mockApiResponse({ message: '会话删除成功' });
  }
  
  // 正常的API请求
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
 * @description 保存完整对话内容到服务器
 * @param {Object} conversationData - 完整的会话数据
 * @returns {Promise<Object>} 保存结果
 */
export const saveConversation = async (conversationData) => {
  // 使用模拟数据进行调试
  if (USE_MOCK_DATA) {
    // 添加模拟延迟，模拟网络请求
    await mockDelay(600);
    console.log('使用模拟数据: saveConversation, conversationId =', conversationData.id);
    // 打印保存的数据以便调试
    console.log('保存的对话数据:', JSON.stringify(conversationData).substring(0, 200) + '...');
    return mockApiResponse({ message: '会话保存成功', id: conversationData.id });
  }

  // 正常的API请求
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations/${conversationData.id}`,
      method: 'PUT',
      data: conversationData
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('保存会话失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 测试AIQA接口
 * @param {string} question - 用户提问
 * @param {Object} contextInfo - 用户上下文信息
 * @returns {Promise<Object>} 请求结果
 */
export const testAIQA = async (question, contextInfo = {}) => {
  try {
    // 改为POST请求，将问题和上下文信息作为请求体发送
    const response = await request({
      url: AIQA_TEST_URL,
      method: 'POST',
      data: {
        question: question,
        context: contextInfo
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('测试AIQA失败:', error);
    return { success: false, error: handleError(error) };
  }
}; 