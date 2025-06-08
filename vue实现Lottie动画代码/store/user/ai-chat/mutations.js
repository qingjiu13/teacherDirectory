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
     * 设置历史会话摘要列表
     * @param {Object} state - Vuex状态对象
     * @param {Array<Object>} summaries - 历史会话摘要列表
     */
    SET_HISTORY_SUMMARIES(state, summaries) {
        if (!state.aiChat.historySummaries) {
            state.aiChat.historySummaries = [];
        }
        
        if (Array.isArray(summaries)) {
            state.aiChat.historySummaries = summaries;
        }
    },
    
    /**
     * 添加一条会话记录
     * @param {Object} state - Vuex状态对象
     * @param {Object} conversation - 会话对象
     */
    ADD_CONVERSATION(state, conversation) {
        if (!conversation || !conversation.id) return;
        
        // 查找是否已存在
        const index = state.aiChat.conversations.findIndex(c => c.id === conversation.id);
        
        if (index !== -1) {
            // 更新已存在的会话
            state.aiChat.conversations.splice(index, 1, conversation);
        } else {
            // 添加新会话
            state.aiChat.conversations.push(conversation);
        }
    },
    
    /**
     * 移除一条会话记录
     * @param {Object} state - Vuex状态对象
     * @param {String} conversationId - 会话ID
     */
    REMOVE_CONVERSATION(state, conversationId) {
        if (!conversationId) return;
        
        state.aiChat.conversations = state.aiChat.conversations.filter(c => c.id !== conversationId);
    },
    
    /**
     * 添加一条历史摘要
     * @param {Object} state - Vuex状态对象
     * @param {Object} summary - 历史摘要对象
     */
    ADD_HISTORY_SUMMARY(state, summary) {
        if (!summary || !summary.id) return;
        
        if (!state.aiChat.historySummaries) {
            state.aiChat.historySummaries = [];
        }
        
        // 查找是否已存在
        const index = state.aiChat.historySummaries.findIndex(s => s.id === summary.id);
        
        if (index !== -1) {
            // 更新已存在的摘要
            state.aiChat.historySummaries.splice(index, 1, summary);
        } else {
            // 添加新摘要
            state.aiChat.historySummaries.push(summary);
        }
    },
    
    /**
     * 移除一条历史摘要
     * @param {Object} state - Vuex状态对象
     * @param {String} summaryId - 摘要ID
     */
    REMOVE_HISTORY_SUMMARY(state, summaryId) {
        if (!summaryId) return;
        
        if (state.aiChat.historySummaries) {
            state.aiChat.historySummaries = state.aiChat.historySummaries.filter(s => s.id !== summaryId);
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
    },
    
    /**
     * 更新当前活跃的对话ID
     * @param {Object} state - Vuex状态对象
     * @param {string|null} conversationId - 对话ID
     */
    UPDATE_CURRENT_CONVERSATION(state, conversationId) {
        state.aiChat.activeConversation = conversationId;
    },
    
    /**
     * 更新用户选择的聊天模式
     * @param {Object} state - Vuex状态对象
     * @param {string} chatMode - 聊天模式
     */
    UPDATE_CHAT_MODE(state, chatMode) {
        state.aiChat.chatMode = chatMode;
    },
    
    /**
     * 更新用户信息
     * @param {Object} state - Vuex状态对象
     * @param {Object} userInfo - 用户信息
     * @param {string} userInfo.school - 用户学校
     * @param {string} userInfo.major - 用户专业
     */
    UPDATE_USER_INFO(state, userInfo) {
        state.aiChat.userInfo = {
            ...state.aiChat.userInfo,
            ...userInfo
        };
    },
    
    /**
     * 更新用户学校信息
     * @param {Object} state - Vuex状态对象
     * @param {string} school - 用户学校
     */
    UPDATE_USER_SCHOOL(state, school) {
        if (!state.aiChat.userInfo) {
            state.aiChat.userInfo = {
                school: '',
                major: ''
            };
        }
        state.aiChat.userInfo.school = school;
    },
    
    /**
     * 更新用户专业信息
     * @param {Object} state - Vuex状态对象
     * @param {string} major - 用户专业
     */
    UPDATE_USER_MAJOR(state, major) {
        if (!state.aiChat.userInfo) {
            state.aiChat.userInfo = {
                school: '',
                major: ''
            };
        }
        state.aiChat.userInfo.major = major;
    },
    
    /**
     * 从对话列表中删除指定ID的对话
     * @param {Object} state - Vuex状态对象
     * @param {string} conversationId - 对话ID
     */
    DELETE_CONVERSATION(state, conversationId) {
        state.aiChat.conversations = state.aiChat.conversations.filter(
            conv => conv.id !== conversationId
        );
        
        // 如果删除的是当前活跃对话，则清空当前活跃对话
        if (state.aiChat.activeConversation === conversationId) {
            state.aiChat.activeConversation = null;
        }
    },
    
    // ===================== 学校搜索相关 mutations =====================
    
    /**
     * 设置学校搜索关键词
     * @param {Object} state - Vuex状态对象
     * @param {string} keyword - 搜索关键词
     */
    SET_AI_SCHOOL_SEARCH_KEYWORD(state, keyword) {
        state.aiChat.schoolSearch.searchKeyword = keyword;
    },
    
    /**
     * 设置学校选项列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} options - 学校选项列表 [{id, name}]
     */
    SET_AI_SCHOOL_OPTIONS(state, options) {
        state.aiChat.schoolSearch.options = options;
    },
    
    /**
     * 设置学校搜索加载状态
     * @param {Object} state - Vuex状态对象
     * @param {boolean} isLoading - 是否正在加载
     */
    SET_AI_SCHOOL_LOADING(state, isLoading) {
        state.aiChat.schoolSearch.isLoading = isLoading;
    },
    
    /**
     * 设置选中的学校
     * @param {Object} state - Vuex状态对象
     * @param {Object} school - 学校信息
     * @param {number} school.id - 学校ID
     * @param {string} school.name - 学校名称
     */
    SET_AI_SELECTED_SCHOOL(state, { id, name }) {
        state.aiChat.schoolSearch.selectedSchoolId = id;
        state.aiChat.schoolSearch.selectedSchool = name;
        // 同时更新用户信息
        state.aiChat.userInfo.school = name;
    },
    
    // ===================== 专业搜索相关 mutations =====================
    
    /**
     * 设置专业搜索关键词
     * @param {Object} state - Vuex状态对象
     * @param {string} keyword - 搜索关键词
     */
    SET_AI_MAJOR_SEARCH_KEYWORD(state, keyword) {
        state.aiChat.majorSearch.searchKeyword = keyword;
    },
    
    /**
     * 设置专业选项列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} options - 专业选项列表 [{id, name}]
     */
    SET_AI_MAJOR_OPTIONS(state, options) {
        state.aiChat.majorSearch.options = options;
    },
    
    /**
     * 设置选中的专业
     * @param {Object} state - Vuex状态对象
     * @param {Object} major - 专业信息
     * @param {number} major.id - 专业ID
     * @param {string} major.name - 专业名称
     */
    SET_AI_SELECTED_MAJOR(state, { id, name }) {
        state.aiChat.majorSearch.selectedMajorId = id;
        state.aiChat.majorSearch.selectedMajor = name;
        // 同时更新用户信息
        state.aiChat.userInfo.major = name;
    }
}; 