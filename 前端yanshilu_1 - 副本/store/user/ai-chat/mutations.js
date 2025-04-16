/**
 * ai-chat模块的mutations
 * @module store/user/ai-chat/mutations
 */

export default {
    /**
     * 更新对话列表（仅包含摘要、ID和聊天模式）
     * @param {Object} state - Vuex状态对象
     * @param {Array<Object>} conversationsList - 对话列表数据
     * @param {string} conversationsList[].id - 对话ID
     * @param {string} conversationsList[].abstract - 对话摘要
     * @param {string} conversationsList[].chatMode - 对话模式
     */
    UPDATE_CONVERSATIONS_LIST(state, conversationsList) {
        if (Array.isArray(conversationsList)) {
            // 只保留需要的字段
            const simplifiedList = conversationsList.map(conversation => ({
                id: conversation.id,
                abstract: conversation.abstract,
                chatMode: conversation.chatMode,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt
            }));
            
            state.aiChat.conversations = simplifiedList;
        }
    },
    
    /**
     * 根据对话ID更新完整对话内容
     * @param {Object} state - Vuex状态对象
     * @param {Object} conversationData - 完整的对话数据
     * @param {string} conversationData.id - 对话ID
     */
    UPDATE_CONVERSATION_DETAIL(state, conversationData) {
        if (!conversationData || !conversationData.id) return;
        
        // 查找是否已存在该对话
        const index = state.aiChat.conversations.findIndex(
            conv => conv.id === conversationData.id
        );
        
        if (index !== -1) {
            // 更新已存在的对话
            state.aiChat.conversations[index] = conversationData;
        } else {
            // 添加新对话
            state.aiChat.conversations.push(conversationData);
        }
        
        // 设置当前活跃对话
        state.aiChat.activeConversation = conversationData.id;
    }
}; 