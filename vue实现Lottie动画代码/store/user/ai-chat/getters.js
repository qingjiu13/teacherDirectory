/**
 * ai-chat模块的getters
 * @module store/user/ai-chat/getters
 */

export default {
    /**
     * 获取历史会话摘要列表
     * @param {Object} state - 状态对象
     * @returns {Array<Object>} 历史会话摘要列表
     */
    historySummaries(state) {
        return state.aiChat.conversations.map(conversation => ({
            id: conversation.id,
            abstract: conversation.abstract,
            chatMode: conversation.chatMode,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt
        }));
    },
    
    /**
     * 获取完整的历史会话列表
     * @param {Object} state - 状态对象
     * @returns {Array<Object>} 完整的历史会话列表
     */
    historyChats(state) {
        return state.aiChat.conversations;
    },
    
    /**
     * 获取当前活跃对话ID
     * @param {Object} state - 状态对象
     * @returns {string|null} 当前活跃对话ID
     */
    currentChatId(state) {
        return state.aiChat.activeConversation;
    },
    
    /**
     * 获取当前活跃对话内容
     * @param {Object} state - 状态对象
     * @returns {Object|null} 当前活跃对话内容
     */
    currentChat(state) {
        if (!state.aiChat.activeConversation) return null;
        
        return state.aiChat.conversations.find(
            conv => conv.id === state.aiChat.activeConversation
        ) || null;
    },
    
    /**
     * 获取当前对话的消息列表
     * @param {Object} state - 状态对象
     * @returns {Array<Object>} 当前对话的消息列表
     */
    currentMessages(state) {
        if (!state.aiChat.activeConversation) return [];
        
        const currentConversation = state.aiChat.conversations.find(
            conv => conv.id === state.aiChat.activeConversation
        );
        
        return currentConversation?.messages || [];
    },
    
    /**
     * 获取当前聊天模式
     * @param {Object} state - 状态对象
     * @returns {string} 当前聊天模式
     */
    currentChatMode(state) {
        return state.aiChat.chatMode;
    },

    /**
     * 获取分页信息
     * @param {Object} state - 状态对象
     * @returns {Object} 分页信息
     */
    pagination(state) {
        return state.aiChat.pagination;
    },

    /**
     * 获取当前页码
     * @param {Object} state - 状态对象
     * @returns {number} 当前页码
     */
    currentPage(state) {
        return state.aiChat.pagination.pageNum;
    },

    /**
     * 获取每页大小
     * @param {Object} state - 状态对象
     * @returns {number} 每页大小
     */
    pageSize(state) {
        return state.aiChat.pagination.pageSize;
    },

    /**
     * 获取总记录数
     * @param {Object} state - 状态对象
     * @returns {number} 总记录数
     */
    totalRecords(state) {
        return state.aiChat.pagination.total;
    },

    /**
     * 获取总页数
     * @param {Object} state - 状态对象
     * @returns {number} 总页数
     */
    totalPages(state) {
        return state.aiChat.pagination.totalPages;
    },

    /**
     * 是否有下一页
     * @param {Object} state - 状态对象
     * @returns {boolean} 是否有下一页
     */
    hasNextPage(state) {
        return state.aiChat.pagination.hasNext;
    },

    /**
     * 是否有上一页
     * @param {Object} state - 状态对象
     * @returns {boolean} 是否有上一页
     */
    hasPrevPage(state) {
        return state.aiChat.pagination.hasPrev;
    },

    /**
     * 是否正在加载分页数据
     * @param {Object} state - 状态对象
     * @returns {boolean} 是否正在加载
     */
    isPaginationLoading(state) {
        return state.aiChat.pagination.loading;
    },

    /**
     * 获取分页显示信息
     * @param {Object} state - 状态对象
     * @returns {string} 分页显示信息，如 "第 1 页，共 10 页"
     */
    paginationInfo(state) {
        const { pageNum, totalPages, total } = state.aiChat.pagination;
        return `第 ${pageNum} 页，共 ${totalPages} 页（总计 ${total} 条记录）`;
    }
}; 