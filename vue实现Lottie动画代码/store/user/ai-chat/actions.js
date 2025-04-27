/**
 * ai-chat模块的actions
 * @module store/user/ai-chat/actions
 */

// 直接导入API
const { questionAI, getConversationHistory, getConversationDetail, deleteConversationHistory } = {
    // 这里可以替换为真实API实现
    questionAI: (params) => Promise.resolve({ success: true, data: '', chatId: params.chatId || 'new-chat-id' }),
    getConversationHistory: () => Promise.resolve({ success: true, data: [] }),
    getConversationDetail: (params) => Promise.resolve({ success: true, data: { id: params.conversationId, messages: [] } }),
    deleteConversationHistory: () => Promise.resolve({ success: true })
};

export default {
    /**
     * 设置当前活跃的聊天会话
     * @param {Object} context - Vuex上下文
     * @param {string} chatId - 聊天会话ID
     */
    setCurrentChat({ commit }, chatId) {
        commit('UPDATE_CURRENT_CONVERSATION', chatId);
    },
    
    /**
     * 发送问题到AI并获取回答
     * @param {Object} context - Vuex上下文
     * @param {Object} payload - 请求数据
     * @param {string} payload.question - 用户问题
     * @param {Object} payload.contextInfo - 上下文信息
     * @param {string} payload.chatId - 对话ID
     * @returns {Promise<Object>} 返回请求结果
     */
    async sendQuestion({ commit, state }, payload) {
        try {
            // 构建上下文信息
            const contextInfo = payload.contextInfo || {
                mode: state.aiChat.chatMode,
                userSchool: state.aiChat.userInfo.school,
                userMajor: state.aiChat.userInfo.major
            };
            
            const response = await questionAI({
                question: payload.question,
                contextInfo: contextInfo,
                chatId: payload.chatId || state.aiChat.activeConversation
            });
            
            // 如果API返回新的chatId，则更新当前会话ID
            if (response.success && response.chatId) {
                commit('UPDATE_CURRENT_CONVERSATION', response.chatId);
                
                // 在本地保存问答记录
                const newMessage = {
                    id: `msg-${Date.now()}`,
                    type: 'user',
                    content: payload.question,
                    timestamp: new Date().toISOString()
                };
                
                const aiResponse = {
                    id: `msg-${Date.now() + 1}`,
                    type: 'ai',
                    content: response.data,
                    timestamp: new Date().toISOString()
                };
                
                // 查找当前对话
                const currentChat = state.aiChat.conversations.find(
                    conv => conv.id === response.chatId
                );
                
                if (currentChat) {
                    // 更新现有对话
                    const updatedChat = {
                        ...currentChat,
                        messages: [...(currentChat.messages || []), newMessage, aiResponse],
                        updatedAt: new Date().toISOString()
                    };
                    
                    commit('UPDATE_CONVERSATION_DETAIL', updatedChat);
                } else {
                    // 创建新对话
                    const newChat = {
                        id: response.chatId,
                        abstract: payload.question.substring(0, 30) + (payload.question.length > 30 ? '...' : ''),
                        chatMode: state.aiChat.chatMode,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        messages: [newMessage, aiResponse]
                    };
                    
                    commit('UPDATE_CONVERSATION_DETAIL', newChat);
                }
            }
            
            return {
                success: true,
                data: response.data,
                chatId: response.chatId
            };
        } catch (error) {
            console.error('AI问答出错:', error);
            return {
                success: false,
                error: error.error || error,
                message: error.error?.message || '请求失败'
            };
        }
    },
    
    /**
     * 获取用户的对话历史记录列表
     * @param {Object} context - Vuex上下文
     * @returns {Promise<Object>} 返回请求结果
     */
    async getHistoryChats({ commit }) {
        try {
            const response = await getConversationHistory({});
            
            if (response.success) {
                // 更新对话历史列表
                commit('UPDATE_CONVERSATIONS_LIST', response.data);
            }
            
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('获取历史记录失败:', error);
            return {
                success: false,
                error: error.error || error,
                message: error.error?.message || '获取历史记录失败'
            };
        }
    },
    
    /**
     * 加载特定对话的完整内容
     * @param {Object} context - Vuex上下文
     * @param {string} conversationId - 对话ID
     * @returns {Promise<Object>} 返回请求结果
     */
    async loadChat({ commit }, conversationId) {
        try {
            const response = await getConversationDetail({
                conversationId: conversationId
            });
            
            if (response.success) {
                // 更新对话详情并设置为当前活跃对话
                commit('UPDATE_CONVERSATION_DETAIL', response.data);
            }
            
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('加载对话详情失败:', error);
            return {
                success: false,
                error: error.error || error,
                message: error.error?.message || '加载对话详情失败'
            };
        }
    },
    
    /**
     * 保存新的对话或更新现有对话
     * @param {Object} context - Vuex上下文
     * @param {Object} chatData - 对话数据
     * @returns {Promise<Object>} 返回操作结果
     */
    async saveChat({ commit, state }, chatData) {
        try {
            // 这里可以添加API调用来保存对话到后端
            // 但对于前端演示，我们只在本地更新
            
            const existingConversation = state.aiChat.conversations.find(
                conv => conv.id === chatData.id
            );
            
            if (existingConversation) {
                // 更新已有对话
                commit('UPDATE_CONVERSATION_DETAIL', {
                    ...existingConversation,
                    ...chatData,
                    updatedAt: new Date().toISOString()
                });
            } else {
                // 添加新对话
                const newConversation = {
                    id: chatData.id,
                    abstract: chatData.title || '新对话',
                    chatMode: chatData.chatMode || 'general',
                    createdAt: chatData.createdAt?.toISOString() || new Date().toISOString(),
                    updatedAt: chatData.updatedAt?.toISOString() || new Date().toISOString(),
                    messages: chatData.messages || []
                };
                
                commit('UPDATE_CONVERSATION_DETAIL', newConversation);
            }
            
            return { success: true };
        } catch (error) {
            console.error('保存对话失败:', error);
            return {
                success: false,
                message: '保存对话失败'
            };
        }
    },
    
    /**
     * 删除指定的对话
     * @param {Object} context - Vuex上下文
     * @param {string} conversationId - 对话ID
     * @returns {Promise<Object>} 返回操作结果
     */
    async deleteChat({ commit, state }, conversationId) {
        try {
            // 调用API从后端删除对话
            const response = await deleteConversationHistory({
                conversationId: conversationId
            });
            
            if (response.success) {
                // 从本地会话列表中移除
                commit('DELETE_CONVERSATION', conversationId);
                
                // 如果删除的是当前活跃会话，则清空当前活跃会话
                if (state.aiChat.activeConversation === conversationId) {
                    commit('UPDATE_CURRENT_CONVERSATION', null);
                }
            }
            
            return { 
                success: response.success,
                message: response.success ? '删除成功' : '删除失败'
            };
        } catch (error) {
            console.error('删除对话失败:', error);
            return {
                success: false,
                error: error.error || error,
                message: error.error?.message || '删除对话失败'
            };
        }
    }
};