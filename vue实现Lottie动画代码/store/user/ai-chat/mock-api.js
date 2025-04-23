/**
 * AI聊天模块的模拟API实现
 * @module store/user/ai-chat/mock-api
 */

import { 
  MOCK_USER_ID, 
  MOCK_CONVERSATIONS, 
  MOCK_CONVERSATION_DETAILS, 
  generateMockAIResponse, 
  mockApiResponse 
} from './mock-data';

/**
 * 模拟的延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 模拟发送问题到AI并获取回答
 * @param {Object} data - 请求数据
 * @param {string} data.question - 用户问题
 * @param {Object} data.contextInfo - 上下文信息
 * @param {string} data.chatId - 对话ID
 * @returns {Promise<Object>} 返回请求结果
 */
export const questionAI = async (data) => {
  try {
    // 模拟网络延迟
    await delay(1000);
    
    // 模拟API处理逻辑
    let chatId = data.chatId;
    // 如果没有chatId，创建一个新的
    if (!chatId) {
      chatId = `conv-${Date.now()}`;
    }
    
    // 使用模拟函数生成AI回答
    const answer = generateMockAIResponse(data.question, data.contextInfo);
    
    // 返回API响应格式的数据
    return {
      success: true,
      data: answer,
      chatId: chatId
    };
  } catch (error) {
    console.error('模拟AI问答出错:', error);
    return {
      success: false,
      error: {
        message: '请求失败'
      }
    };
  }
};

/**
 * 模拟中断当前请求
 * @param {Object} requestTask - 请求任务对象
 */
export const abortRequest = (requestTask) => {
  console.log('模拟中断请求:', requestTask);
  // 在模拟环境中不需要实际实现
};

/**
 * 模拟获取用户的对话历史记录列表
 * @param {Object} data - 请求数据
 * @returns {Promise<Object>} 返回请求结果
 */
export const getConversationHistory = async (data) => {
  try {
    // 模拟网络延迟
    await delay(800);
    
    // 返回模拟数据
    return mockApiResponse(true, MOCK_CONVERSATIONS);
  } catch (error) {
    console.error('模拟获取历史记录失败:', error);
    return mockApiResponse(false, null, {
      message: '获取历史记录失败'
    });
  }
};

/**
 * 模拟获取特定对话的详细内容
 * @param {Object} data - 请求数据
 * @param {string} data.conversationId - 对话ID
 * @returns {Promise<Object>} 返回请求结果
 */
export const getConversationDetail = async (data) => {
  try {
    // 模拟网络延迟
    await delay(600);
    
    const conversation = MOCK_CONVERSATION_DETAILS[data.conversationId];
    
    if (!conversation) {
      return mockApiResponse(false, null, {
        message: '对话不存在'
      });
    }
    
    return mockApiResponse(true, conversation);
  } catch (error) {
    console.error('模拟获取对话详情失败:', error);
    return mockApiResponse(false, null, {
      message: '获取对话详情失败'
    });
  }
};

/**
 * 模拟删除特定对话历史记录
 * @param {Object} data - 请求数据
 * @param {string} data.conversationId - 需要删除的对话ID
 * @returns {Promise<Object>} 返回请求结果
 */
export const deleteConversationHistory = async (data) => {
  try {
    // 模拟网络延迟
    await delay(500);
    
    const conversation = MOCK_CONVERSATION_DETAILS[data.conversationId];
    
    if (!conversation) {
      return mockApiResponse(false, null, {
        message: '对话不存在'
      });
    }
    
    // 在实际应用中，这里会从后端删除数据
    // 在模拟环境中，我们只返回成功
    return mockApiResponse(true, { message: '删除成功' });
  } catch (error) {
    console.error('模拟删除对话失败:', error);
    return mockApiResponse(false, null, {
      message: '删除对话失败'
    });
  }
};

/**
 * 模拟保存对话
 * 这个API在原始代码中没有，但为了完整性添加
 * @param {Object} data - 对话数据
 * @returns {Promise<Object>} 返回请求结果
 */
export const saveConversation = async (data) => {
  try {
    // 模拟网络延迟
    await delay(700);
    
    // 在实际应用中，这里会保存数据到后端
    // 在模拟环境中，我们只返回成功
    return mockApiResponse(true, { message: '保存成功', id: data.id });
  } catch (error) {
    console.error('模拟保存对话失败:', error);
    return mockApiResponse(false, null, {
      message: '保存对话失败'
    });
  }
}; 