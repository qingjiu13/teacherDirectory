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
import store from '../../../index.js';

/**
 * 封装uni.request为Promise形式
 * @param {Object} options - 请求配置
 * @returns {Promise<Object>} - 返回请求结果的Promise
 */
const uniRequest = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: options.url,
            data: options.data || options.params,
            method: options.method || 'GET',
            header: options.header || {},
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
 * 发送消息给AI并获取回复
 * @param {Object} messageData - 消息数据
 * @param {string} messageData.content - 用户输入的消息内容
 * @param {string} messageData.chatMode - 聊天模式: 'general'(通用) | 'school'(择校) | 'career'(职业规划)
 * @param {string|null} messageData.conversationId - 对话ID，若为新对话则为null
 * @returns {Promise<Object>} - 返回AI回复的内容和对话ID
 */
export const sendMessageToAI = async (messageData) => {
    try {
        // 获取用户ID
        const userId = store.state.user.baseInfo.id;
        // 获取用户学校和专业信息
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
        
        // 发送请求
        const response = await uniRequest({
            url: AIQA_QUESTION_URL,
            method: 'POST',
            data: requestData
        });
        
        // 检查请求是否成功
        if (response.data && response.data.code === 200) {
            return {
                success: true,
                conversationId: response.data.data.conversationId,
                aiResponse: response.data.data.aiResponse,
                messageId: response.data.data.messageId
            };
        } else {
            console.error('AI回复失败:', response.data.message || '未知错误');
            return {
                success: false,
                message: response.data.message || '获取AI回复失败'
            };
        }
    } catch (error) {
        console.error('发送消息给AI时出错:', error);
        return {
            success: false,
            message: '网络错误，请稍后重试'
        };
    }
};

/**
 * 获取用户的所有对话历史摘要
 * @returns {Promise<Object>} - 返回对话历史列表
 */
export const getConversationHistory = async () => {
    try {
        // 获取用户ID
        const userId = store.state.user.baseInfo.id;
        
        // 发送请求
        const response = await uniRequest({
            url: AIQA_GET_HISTORY_URL,
            method: 'GET',
            data: { userId }
        });
        
        // 检查请求是否成功
        if (response.data && response.data.code === 200) {
            return {
                success: true,
                conversations: response.data.data.conversations
            };
        } else {
            console.error('获取对话历史失败:', response.data.message || '未知错误');
            return {
                success: false,
                message: response.data.message || '获取对话历史失败'
            };
        }
    } catch (error) {
        console.error('获取对话历史时出错:', error);
        return {
            success: false,
            message: '网络错误，请稍后重试'
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
        // 获取用户ID
        const userId = store.state.user.baseInfo.id;
        
        // 发送请求
        const response = await uniRequest({
            url: AIQA_GET_HISTORY_DETAIL_URL,
            method: 'GET',
            data: { 
                userId,
                conversationId 
            }
        });
        
        // 检查请求是否成功
        if (response.data && response.data.code === 200) {
            return {
                success: true,
                messages: response.data.data.messages
            };
        } else {
            console.error('获取对话详情失败:', response.data.message || '未知错误');
            return {
                success: false,
                message: response.data.message || '获取对话详情失败'
            };
        }
    } catch (error) {
        console.error('获取对话详情时出错:', error);
        return {
            success: false,
            message: '网络错误，请稍后重试'
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
        // 获取用户ID
        const userId = store.state.user.baseInfo.id;
        
        // 发送请求
        const response = await uniRequest({
            url: AIQA_DELETE_HISTORY_URL,
            method: 'POST',
            data: {
                userId,
                conversationId
            }
        });
        
        // 检查请求是否成功
        if (response.data && response.data.code === 200) {
            return {
                success: true,
                message: '对话已成功删除'
            };
        } else {
            console.error('删除对话失败:', response.data.message || '未知错误');
            return {
                success: false,
                message: response.data.message || '删除对话失败'
            };
        }
    } catch (error) {
        console.error('删除对话时出错:', error);
        return {
            success: false,
            message: '网络错误，请稍后重试'
        };
    }
}; 