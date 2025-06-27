/**
 * ai-chat模块的mutations
 * @module store/user/ai-chat/mutations
 */

export default {
    /**
     * 更新对话列表
     * @param {Object} state - Vuex状态对象
     * @param {Array<Object>} conversationsList - 对话列表数据（已经过actions处理的格式化数据）
     * @param {string} conversationsList[].id - 对话ID
     * @param {string} conversationsList[].abstract - 对话摘要/标题（已从后端title字段映射）
     * @param {string} conversationsList[].chatMode - 对话模式（已从后端topic字段映射）
     * @param {string} conversationsList[].type - 对话类型
     * @description 此方法接收的是已经过actions.js处理的格式化数据
     */
    UPDATE_CONVERSATIONS_LIST(state, conversationsList) {
        if (Array.isArray(conversationsList)) {
            // 保留所有需要的字段
            const processedList = conversationsList.map(conversation => ({
                id: conversation.id,
                abstract: conversation.abstract,
                chatMode: conversation.chatMode || 'general',
                type: conversation.type,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                createBy: conversation.createBy,
                updateBy: conversation.updateBy,
                remark: conversation.remark,
                // 保留消息数组（如果存在）
                messages: conversation.messages || []
            }));
            
            state.aiChat.conversations = processedList;
            
            console.log('=== Mutations: 更新对话列表 ===');
            console.log('更新的对话数量:', processedList.length);
            console.log('更新后的对话列表:', processedList);
            console.log('============================');
        }
    },
    
    /**
     * 追加对话列表（用于分页加载更多）
     * @param {Object} state - Vuex状态对象
     * @param {Array<Object>} conversationsList - 要追加的对话列表数据（已经过actions处理的格式化数据）
     * @description 此方法接收的是已经过actions.js处理的格式化数据
     */
    APPEND_CONVERSATIONS_LIST(state, conversationsList) {
        if (Array.isArray(conversationsList)) {
            // 处理新的对话数据
            const processedList = conversationsList.map(conversation => ({
                id: conversation.id,
                abstract: conversation.abstract,
                chatMode: conversation.chatMode || 'general',
                type: conversation.type,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                createBy: conversation.createBy,
                updateBy: conversation.updateBy,
                remark: conversation.remark,
                messages: conversation.messages || []
            }));
            
            // 过滤掉已存在的对话，避免重复
            const existingIds = new Set(state.aiChat.conversations.map(conv => conv.id));
            const newConversations = processedList.filter(conv => !existingIds.has(conv.id));
            
            // 追加新对话到现有列表
            state.aiChat.conversations = [...state.aiChat.conversations, ...newConversations];
            
            console.log('=== Mutations: 追加对话列表 ===');
            console.log('新增对话数量:', newConversations.length);
            console.log('总对话数量:', state.aiChat.conversations.length);
            console.log('============================');
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
    
    /**
     * 更新分页信息
     * @param {Object} state - Vuex状态对象
     * @param {Object} paginationInfo - 分页信息
     * @param {number} paginationInfo.pageNum - 当前页码
     * @param {number} paginationInfo.pageSize - 每页大小
     * @param {number} paginationInfo.total - 总记录数
     * @param {number} paginationInfo.totalPages - 总页数
     */
    UPDATE_PAGINATION(state, paginationInfo) {
        state.aiChat.pagination = {
            ...state.aiChat.pagination,
            ...paginationInfo,
            hasNext: paginationInfo.pageNum < paginationInfo.totalPages,
            hasPrev: paginationInfo.pageNum > 1
        };
    },

    /**
     * 设置当前页码
     * @param {Object} state - Vuex状态对象
     * @param {number} pageNum - 页码
     */
    SET_PAGE_NUM(state, pageNum) {
        state.aiChat.pagination.pageNum = pageNum;
        state.aiChat.pagination.hasNext = pageNum < state.aiChat.pagination.totalPages;
        state.aiChat.pagination.hasPrev = pageNum > 1;
    },

    /**
     * 设置每页大小
     * @param {Object} state - Vuex状态对象
     * @param {number} pageSize - 每页大小
     */
    SET_PAGE_SIZE(state, pageSize) {
        state.aiChat.pagination.pageSize = pageSize;
        // 重新计算总页数
        if (state.aiChat.pagination.total > 0) {
            state.aiChat.pagination.totalPages = Math.ceil(state.aiChat.pagination.total / pageSize);
            state.aiChat.pagination.hasNext = state.aiChat.pagination.pageNum < state.aiChat.pagination.totalPages;
        }
    },

    /**
     * 设置分页加载状态
     * @param {Object} state - Vuex状态对象
     * @param {boolean} loading - 是否正在加载
     */
    SET_PAGINATION_LOADING(state, loading) {
        state.aiChat.pagination.loading = loading;
    },

    /**
     * 重置分页状态
     * @param {Object} state - Vuex状态对象
     */
    RESET_PAGINATION(state) {
        state.aiChat.pagination = {
            pageSize: 10,
            pageNum: 1,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
            loading: false
        };
    },

    /**
     * 添加消息到当前对话
     * @param {Object} state - Vuex状态对象
     * @param {Object} message - 消息对象
     * @param {string} message.id - 消息ID
     * @param {string} message.role - 消息角色（user/AI）
     * @param {string} message.content - 消息内容
     * @param {string} message.timestamp - 时间戳
     * @param {string} message.status - 消息状态
     */
    ADD_MESSAGE_TO_CURRENT_CONVERSATION(state, message) {
        if (!message.id) return;
        
        const currentConversationId = state.aiChat.activeConversation;
        
        // 如果没有当前活跃对话，不添加消息（等待后端返回conversationId）
        if (!currentConversationId) {
            console.warn('没有活跃对话，消息将在收到conversationId后添加');
            return;
        }
        
        // 查找当前对话
        let conversationIndex = state.aiChat.conversations.findIndex(
            conv => conv.id == currentConversationId // 使用 == 进行比较，支持字符串和数字的比较
        );
        
        // 如果对话不存在，创建一个临时对话结构
        if (conversationIndex === -1) {
            console.log('对话不存在，创建临时对话结构:', currentConversationId);
            const tempConversation = {
                id: currentConversationId,
                abstract: '新对话',
                chatMode: state.aiChat.chatMode || 'general',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messages: []
            };
            
            state.aiChat.conversations.push(tempConversation);
            conversationIndex = state.aiChat.conversations.length - 1;
        }
        
        const conversation = state.aiChat.conversations[conversationIndex];
        
        // 确保messages数组存在
        if (!conversation.messages) {
            conversation.messages = [];
        }
        
        // 检查是否已存在相同ID的消息，避免重复添加
        const existingMessageIndex = conversation.messages.findIndex(
            msg => msg.id === message.id
        );
        
        if (existingMessageIndex === -1) {
            // 消息不存在，添加新消息
            conversation.messages.push(message);
            
            // 更新对话的更新时间
            conversation.updatedAt = new Date().toISOString();
            
            console.log('✅ 已添加消息到对话:', {
                conversationId: currentConversationId,
                messageId: message.id,
                messageRole: message.role,
                totalMessages: conversation.messages.length
            });
        } else {
            // 消息已存在，仅更新内容（如果有必要）
            console.log('消息已存在，跳过添加:', message.id);
        }
    },

    /**
     * 更新指定消息的内容
     * @param {Object} state - Vuex状态对象
     * @param {Object} updateInfo - 更新信息
     * @param {string} updateInfo.messageId - 消息ID
     * @param {string} updateInfo.content - 新的消息内容
     * @param {boolean} [updateInfo.streaming] - 是否正在流式传输
     * @param {string} [updateInfo.status] - 消息状态
     * @param {boolean} [updateInfo.isComplete] - 消息是否完整
     * @param {boolean} [updateInfo.isStreaming] - 是否正在流式传输（兼容性）
     * @param {boolean} [updateInfo.hasError] - 是否有错误
     */
    UPDATE_MESSAGE_CONTENT(state, updateInfo) {
        if (!updateInfo || !updateInfo.messageId) return;
        
        const currentConversationId = state.aiChat.activeConversation;
        if (!currentConversationId) return;
        
        // 查找当前对话
        const conversationIndex = state.aiChat.conversations.findIndex(
            conv => conv.id === currentConversationId
        );
        
        if (conversationIndex !== -1) {
            const conversation = state.aiChat.conversations[conversationIndex];
            
            if (conversation.messages) {
                // 查找要更新的消息
                const messageIndex = conversation.messages.findIndex(
                    msg => msg.id === updateInfo.messageId
                );
                
                if (messageIndex !== -1) {
                    const message = conversation.messages[messageIndex];
                    
                    // 更新消息内容
                    message.content = updateInfo.content;
                    
                    // 更新streaming属性
                    if (updateInfo.hasOwnProperty('streaming')) {
                        message.streaming = updateInfo.streaming;
                    }
                    
                    // 更新status属性
                    if (updateInfo.hasOwnProperty('status')) {
                        message.status = updateInfo.status;
                    }
                    
                    // 更新其他属性（兼容性）
                    if (updateInfo.hasOwnProperty('isComplete')) {
                        message.isComplete = updateInfo.isComplete;
                    }
                    
                    if (updateInfo.hasOwnProperty('isStreaming')) {
                        message.streaming = updateInfo.isStreaming; // 映射到streaming属性
                    }
                    
                    if (updateInfo.hasOwnProperty('hasError')) {
                        message.hasError = updateInfo.hasError;
                    }
                    
                    // 更新时间戳
                    message.timestamp = new Date().toISOString();
                    
                    // 更新对话的更新时间
                    conversation.updatedAt = new Date().toISOString();
                }
            }
        }
    },

    /**
     * 清空当前对话的所有消息
     * @param {Object} state - Vuex状态对象
     */
    CLEAR_CURRENT_CONVERSATION_MESSAGES(state) {
        const currentConversationId = state.aiChat.activeConversation;
        if (!currentConversationId) return;
        
        const conversationIndex = state.aiChat.conversations.findIndex(
            conv => conv.id === currentConversationId
        );
        
        if (conversationIndex !== -1) {
            const conversation = state.aiChat.conversations[conversationIndex];
            conversation.messages = [];
            conversation.updatedAt = new Date().toISOString();
        }
    },

    /**
     * 创建新的对话（准备状态）
     * @param {Object} state - Vuex状态对象
     * @param {Object} [conversationInfo] - 对话信息
     * @param {string} [conversationInfo.chatMode] - 聊天模式
     */
    CREATE_NEW_CONVERSATION(state, conversationInfo = {}) {
        // 清空当前活跃对话ID，等待后端返回新的conversationId
        state.aiChat.activeConversation = null;
        
        // 更新聊天模式
        if (conversationInfo.chatMode) {
            state.aiChat.chatMode = conversationInfo.chatMode;
        }
        
        console.log('✅ 已准备新对话状态，等待后端返回conversationId');
        console.log('   - 当前活跃对话ID:', state.aiChat.activeConversation);
        console.log('   - 聊天模式:', state.aiChat.chatMode);
    },

    /**
     * 根据后端返回的conversationId创建或更新对话
     * @param {Object} state - Vuex状态对象
     * @param {Object} payload - 载荷对象
     * @param {string} payload.conversationId - 后端返回的对话ID
     * @param {string} [payload.abstract] - 对话摘要
     * @param {Array} [payload.messages] - 消息列表
     */
    CREATE_CONVERSATION_FROM_BACKEND(state, payload) {
        if (!payload || !payload.conversationId) return;
        
        const { conversationId, abstract, messages = [] } = payload;
        
        // 查找是否已存在该对话
        const existingConversationIndex = state.aiChat.conversations.findIndex(
            conv => conv.id === conversationId
        );
        
        if (existingConversationIndex === -1) {
            // 对话不存在，创建新对话
            const newConversation = {
                id: conversationId,
                abstract: abstract || '新对话',
                chatMode: state.aiChat.chatMode,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messages: messages
            };
            
            state.aiChat.conversations.push(newConversation);
            console.log('已创建新对话:', conversationId);
        } else {
            // 对话已存在，更新消息列表
            const conversation = state.aiChat.conversations[existingConversationIndex];
            if (messages.length > 0) {
                conversation.messages = messages;
            }
            conversation.updatedAt = new Date().toISOString();
            console.log('已更新现有对话:', conversationId);
        }
        
        // 设置为当前活跃对话
        state.aiChat.activeConversation = conversationId;
    },

    /**
     * 设置当前对话的消息列表
     * @param {Object} state - Vuex状态对象
     * @param {Object} payload - 载荷对象
     * @param {string} payload.conversationId - 对话ID
     * @param {Array} payload.messages - 消息列表
     */
    SET_CURRENT_CONVERSATION_MESSAGES(state, payload) {
        if (!payload || !payload.conversationId || !Array.isArray(payload.messages)) return;
        
        const { conversationId, messages } = payload;
        
        // 查找对话
        const conversationIndex = state.aiChat.conversations.findIndex(
            conv => conv.id === conversationId
        );
        
        if (conversationIndex !== -1) {
            // 更新现有对话的消息列表
            const conversation = state.aiChat.conversations[conversationIndex];
            conversation.messages = messages;
            conversation.updatedAt = new Date().toISOString();
        } else {
            // 创建新对话
            const newConversation = {
                id: conversationId,
                abstract: messages.length > 0 ? 
                    (messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '')) : 
                    '新对话',
                chatMode: state.aiChat.chatMode,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messages: messages
            };
            
            state.aiChat.conversations.push(newConversation);
        }
        
        // 设置为当前活跃对话
        state.aiChat.activeConversation = conversationId;
    }
}; 