/**
 * AI聊天API接口
 * @module store/user/APIroute/AIchat_api
 */
import {
    AIQA_QUESTION_URL,
    AIQA_GET_HISTORY_URL,
    AIQA_DELETE_HISTORY_URL,
    AIQA_GET_HISTORY_DETAIL_URL
} from '../../API.js';
import { apiRequest } from '../../JWT.js';

/**
 * 发送消息给AI并获取回复
 * @param {Object} messageData - 消息数据
 * @param {string} messageData.content - 用户输入的消息内容
 * @param {string} messageData.chatMode - 聊天模式: 'general'(通用) | 'school'(择校) | 'career'(职业规划)
 * @param {string|null} messageData.conversationId - 对话ID，若为新对话则为null
 * @returns {Promise<Object>} - 返回AI回复的内容和对话ID
 */
export const sendMessageToAI = async (messageData) => {
    try {
        // 从store获取用户信息需要import store
        const store = (await import('../../../index.js')).default;
        const userId = store.state.user.baseInfo.id;
        const userSchool = store.state.user.baseInfo.userInfo.school;
        const userMajor = store.state.user.baseInfo.userInfo.major;
        
        // 构建请求数据
        const requestData = {
            userId: userId,
            content: messageData.content,
            chatMode: messageData.chatMode,
            school: userSchool,
            major: userMajor,
            conversationId: messageData.conversationId
        };
        
        // 使用apiRequest发送请求
        const response = await apiRequest(AIQA_QUESTION_URL, 'POST', requestData);
        
        return {
            success: true,
            conversationId: response.data.conversationId,
            aiResponse: response.data.aiResponse,
            messageId: response.data.messageId
        };
    } catch (error) {
        console.error('发送消息给AI时出错:', error);
        return {
            success: false,
            message: error.error?.message || '网络错误，请稍后重试'
        };
    }
};

/**
 * 获取用户的所有对话历史摘要
 * @returns {Promise<Object>} - 返回对话历史列表
 */
export const getConversationHistory = async () => {
    try {
        // 从store获取用户信息
        const store = (await import('../../../index.js')).default;
        const userId = store.state.user.baseInfo.id;
        
        // 使用apiRequest发送请求
        const response = await apiRequest(AIQA_GET_HISTORY_URL, 'GET', { userId });
        
        return {
            success: true,
            conversations: response.data.conversations
        };
    } catch (error) {
        console.error('获取对话历史时出错:', error);
        return {
            success: false,
            message: error.error?.message || '网络错误，请稍后重试'
        };
    }
};

/**
 * 获取特定对话的详细内容
 * @param {string} conversationId - 对话ID
 * @returns {Promise<Object>} - 返回对话详细内容
 */
export const getConversationDetail = async (conversationId) => {
    try {
        // 从store获取用户信息
        const store = (await import('../../../index.js')).default;
        const userId = store.state.user.baseInfo.id;
        
        // 使用apiRequest发送请求
        const response = await apiRequest(AIQA_GET_HISTORY_DETAIL_URL, 'GET', { 
            userId,
            conversationId 
        });
        
        return {
            success: true,
            messages: response.data.messages
        };
    } catch (error) {
        console.error('获取对话详情时出错:', error);
        return {
            success: false,
            message: error.error?.message || '网络错误，请稍后重试'
        };
    }
};

/**
 * 删除特定对话
 * @param {string} conversationId - 对话ID
 * @returns {Promise<Object>} - 返回删除结果
 */
export const deleteConversation = async (conversationId) => {
    try {
        // 从store获取用户信息
        const store = (await import('../../../index.js')).default;
        const userId = store.state.user.baseInfo.id;
        
        // 使用apiRequest发送请求
        const response = await apiRequest(AIQA_DELETE_HISTORY_URL, 'POST', {
            userId,
            conversationId
        });
        
        return {
            success: true,
            message: '对话已成功删除'
        };
    } catch (error) {
        console.error('删除对话时出错:', error);
        return {
            success: false,
            message: error.error?.message || '网络错误，请稍后重试'
        };
    }
}; 