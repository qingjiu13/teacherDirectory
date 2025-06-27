/**
 * ai-chat模块的actions
 * @module store/user/ai-chat/actions
 */

// 导入JWT工具
import { apiRequest, getCurrentToken } from '../JWT.js';
import { useGlobalStore } from '../../global.js';
const getApiPrefix = () => {
    const globalStore = useGlobalStore()
    return globalStore.apiBaseUrl
}

// const API_BASE_URL = 'http://v8e5bd5f.natappfree.cc';
// const API_BASE_URL = 'http://47.109.207.44:8088';

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
     * @param {string} payload.content - 用户问题内容
     * @param {string} [payload.topic] - 聊天主题，可选
     * @param {boolean} [payload.skipUserMessage] - 是否跳过添加用户消息（用于重试场景）
     * @param {Function} [payload.onMessage] - 接收消息的回调函数
     * @param {Function} [payload.onComplete] - 完成的回调函数
     * @param {Function} [payload.onError] - 错误处理回调函数
     * @returns {Promise<Object>} 返回请求结果
     */
    async sendQuestion({ commit, state, rootState }, payload) {
        try {
            let userMessage = null;
            let aiMessageId = null;
            let aiMessage = null;
            let isNewConversation = !state.aiChat.activeConversation;
            
            // 构建请求数据 - 确保conversationId为数字或null
            let conversationIdToSend = null;
            if (state.aiChat.activeConversation) {
                // 如果conversationId是数字字符串，转换为数字
                const activeId = state.aiChat.activeConversation;
                if (/^\d+$/.test(activeId)) {
                    conversationIdToSend = parseInt(activeId, 10);
                } else if (typeof activeId === 'number') {
                    conversationIdToSend = activeId;
                }
            }
            
            // 如果是继续对话（有conversationId）且不跳过用户消息，先添加用户消息
            if (!isNewConversation && !payload.skipUserMessage) {
                userMessage = {
                    id: `msg-user-${Date.now()}`,
                    role: 'user',
                    content: payload.content,
                    timestamp: new Date().toISOString(),
                    status: 'sent'
                };
                
                // 立即添加用户消息到当前对话
                commit('ADD_MESSAGE_TO_CURRENT_CONVERSATION', userMessage);
                
                console.log('✅ 已添加用户消息到历史对话:', userMessage.id);
            }
            
            const requestData = {
                category: 'DOU_BAO_CHAT',
                timestamp: new Date().getTime(),
                payload: {
                    content: payload.content,
                    topic: state.aiChat.chatMode,
                    school: rootState.user.schoolMajorRequest.undergraduateSchoolSearch.selectedSchool,
                    major: rootState.user.schoolMajorRequest.undergraduateMajorSearch.selectedMajor,
                    conversationId: conversationIdToSend
                }
            };

            console.log('=== AI聊天发送数据 ===');
            console.log('原始activeConversation:', state.aiChat.activeConversation);
            console.log('处理后的conversationId:', conversationIdToSend);
            console.log('是否为新对话:', conversationIdToSend === null ? '是' : '否');
            console.log('是否跳过用户消息:', payload.skipUserMessage);
            console.log('完整请求数据:', JSON.stringify(requestData, null, 2));
            console.log('==================');
            
            // 使用WebSocket连接发送消息
            const token = getCurrentToken();
            const wsUrl = `ws://v8e5bd5f.natappfree.cc/websocket/message?token=${token}`;
            // const wsUrl = `ws://47.109.207.44:8088/websocket/message?token=${token}`;
            
            const response = await new Promise((resolve, reject) => {
                // 使用uni-app的WebSocket API
                const socketTask = uni.connectSocket({
                    url: wsUrl,
                    success: () => {
                        console.log('WebSocket连接请求已发送');
                    },
                    fail: (error) => {
                        console.error('WebSocket连接失败:', error);
                        reject(new Error('WebSocket连接失败'));
                    }
                });
                
                // 流式传输相关变量
                let streamContent = '';
                let conversationId = conversationIdToSend; // 初始化为当前对话ID
                let messageCount = 0;
                let isStreamComplete = false;
                let isConversationCreated = false; // 标记对话是否已创建
                
                // 连接打开
                socketTask.onOpen(() => {
                    console.log('WebSocket连接已建立');
                    // 发送请求数据
                    socketTask.send({
                        data: JSON.stringify(requestData),
                        success: () => {
                            console.log('数据发送成功');
                        },
                        fail: (error) => {
                            console.error('数据发送失败:', error);
                            reject(new Error('数据发送失败'));
                        }
                    });
                });
                
                // 接收消息 - 流式处理
                socketTask.onMessage((event) => {
                    try {
                        console.log('=== 流式消息 ===');
                        console.log('原始数据:', event.data);
                        
                        // 检查消息是否为空或无效
                        if (!event.data) {
                            console.warn('收到空消息');
                            return;
                        }
                        
                        let data;
                        
                        // 尝试解析JSON消息
                        if (typeof event.data === 'string') {
                            try {
                                data = JSON.parse(event.data);
                            } catch (parseError) {
                                console.warn('消息不是有效的JSON格式，尝试直接使用:', event.data);
                                data = {
                                    content: event.data,
                                    message: event.data,
                                    category: 'DOU_BAO_CHAT'
                                };
                            }
                        } else {
                            data = event.data;
                        }
                        
                        console.log('解析后数据:', JSON.stringify(data, null, 2));
                        
                        // 检查是否为连接确认消息
                        const content = data.content || data.message || data.payload?.content || '';
                        const isConnectionMessage = content === '连接成功' || content === 'connected' || content === 'connection established';
                        
                        if (isConnectionMessage) {
                            console.log('✅ 收到连接确认消息，开始接收流式数据...');
                            return;
                        }
                        
                        // 检查是否为DOU_BAO_CHAT类型的消息
                        if (data.category === 'DOU_BAO_CHAT') {
                            messageCount++;
                            
                            // 提取消息内容
                            let messageContent = data.content || data.message || data.payload?.content || '';
                            
                            // 更新会话ID（如果收到）- 修复：从payload中获取conversationId
                            const newConversationId = data.conversationId || data.payload?.conversationId;
                            if (newConversationId && !conversationId) {
                                console.log('🆔 收到conversationId:', newConversationId, '来源:', data.conversationId ? 'data.conversationId' : 'data.payload.conversationId');
                                
                                // 如果是新对话且收到了conversationId，创建对话和消息
                                if (isNewConversation && newConversationId && !isConversationCreated) {
                                    console.log('🆔 收到新对话的conversationId，创建对话:', newConversationId);
                                    
                                    // 创建对话
                                    commit('CREATE_CONVERSATION_FROM_BACKEND', {
                                        conversationId: newConversationId,
                                        abstract: payload.content.substring(0, 30) + (payload.content.length > 30 ? '...' : ''),
                                        messages: []
                                    });
                                    
                                    // 如果不跳过用户消息，则创建用户消息记录
                                    if (!payload.skipUserMessage) {
                                        userMessage = {
                                            id: `msg-user-${Date.now()}`,
                                            role: 'user',
                                            content: payload.content,
                                            timestamp: new Date().toISOString(),
                                            status: 'sent'
                                        };
                                        
                                        // 添加用户消息
                                        commit('ADD_MESSAGE_TO_CURRENT_CONVERSATION', userMessage);
                                    }
                                    
                                    isConversationCreated = true;
                                }
                                
                                conversationId = newConversationId;
                            }
                            
                            // 如果还没有AI消息ID，创建AI消息
                            if (!aiMessageId) {
                                aiMessageId = payload.aiMessageId || `msg-ai-${Date.now()}`;
                                aiMessage = {
                                    id: aiMessageId,
                                    role: 'AI',
                                    content: '',
                                    timestamp: new Date().toISOString(),
                                    streaming: true,
                                    status: 'sending'
                                };
                                
                                // 添加AI消息
                                commit('ADD_MESSAGE_TO_CURRENT_CONVERSATION', aiMessage);
                                console.log('✅ 已创建AI消息:', aiMessageId);
                            }
                            
                            // 检查是否为空字段（结束标识）
                            if (messageContent === '' || messageContent === null || messageContent === undefined) {
                                console.log('🏁 收到空字段，流式传输完成');
                                
                                // 在结束时再次检查并更新conversationId
                                const finalConversationId = conversationId || data.conversationId || data.payload?.conversationId;
                                if (finalConversationId && !conversationId) {
                                    conversationId = finalConversationId;
                                    console.log('🆔 在结束时更新conversationId:', conversationId);
                                }
                                
                                isStreamComplete = true;
                                
                                // 清理最终内容，去除多余空行
                                const cleanedContent = streamContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
                                
                                // 更新AI消息为完成状态
                                if (aiMessageId) {
                                    commit('UPDATE_MESSAGE_CONTENT', {
                                        messageId: aiMessageId,
                                        content: cleanedContent,
                                        streaming: false,
                                        status: 'sent'
                                    });
                                }
                                
                                console.log('✅ 流式传输完成:', {
                                    content: cleanedContent,
                                    conversationId: conversationId,
                                    messageCount: messageCount
                                });
                                console.log('   - 最终内容长度:', cleanedContent.length);
                                console.log('   - 总消息片段数:', messageCount);
                                console.log('   - 会话ID:', conversationId);
                                
                                // 调用完成回调
                                if (payload.onComplete) {
                                    payload.onComplete({
                                        content: cleanedContent,
                                        conversationId: conversationId,
                                        messageCount: messageCount
                                    });
                                }
                                
                                // 解析并返回最终结果
                                resolve({
                                    success: true,
                                    data: {
                                        content: cleanedContent,
                                        message: cleanedContent,
                                        conversationId: conversationId,
                                        messageCount: messageCount,
                                        isStreamComplete: true
                                    }
                                });
                                
                                // 关闭连接
                                socketTask.close();
                                return;
                            }
                            
                            
                            // 累积流式内容
                            streamContent += messageContent;
                            
                            console.log(`📝 流式片段 ${messageCount}:`, messageContent);
                            console.log(`📄 累积内容长度: ${streamContent.length}`);
                            console.log(`🆔 会话ID: ${conversationId}`);
                            
                            // 实时更新AI消息内容
                            if (aiMessageId) {
                                commit('UPDATE_MESSAGE_CONTENT', {
                                    messageId: aiMessageId,
                                    content: streamContent,
                                    streaming: true,
                                    status: 'sending'
                                });
                            }
                            
                            // 调用流式消息回调
                            if (payload.onMessage) {
                                payload.onMessage({
                                    content: messageContent,
                                    fullContent: streamContent,
                                    isComplete: false,
                                    conversationId: conversationId,
                                    messageCount: messageCount
                                });
                            }
                            
                            // 检查是否为其他结束标志（保留原有逻辑作为备用）
                            const isEndMessage = data.isEnd || data.finished || data.complete || 
                                                messageContent.includes('[END]') || 
                                                messageContent.includes('[DONE]');
                            
                            if (isEndMessage) {
                                console.log('🏁 流式传输完成（其他结束标志）');
                                
                                // 在结束时再次检查并更新conversationId
                                const finalConversationId = conversationId || data.conversationId || data.payload?.conversationId;
                                if (finalConversationId && !conversationId) {
                                    conversationId = finalConversationId;
                                    console.log('🆔 在结束时更新conversationId（其他结束标志）:', conversationId);
                                }
                                
                                isStreamComplete = true;
                                
                                // 清理最终内容，去除多余空行
                                const cleanedContent = streamContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
                                
                                // 更新AI消息为完成状态
                                if (aiMessageId) {
                                    commit('UPDATE_MESSAGE_CONTENT', {
                                        messageId: aiMessageId,
                                        content: cleanedContent,
                                        streaming: false,
                                        status: 'sent'
                                    });
                                }
                                
                                // 调用完成回调
                                if (payload.onComplete) {
                                    payload.onComplete({
                                        content: cleanedContent,
                                        conversationId: conversationId,
                                        messageCount: messageCount
                                    });
                                }
                                
                                // 解析并返回最终结果
                                resolve({
                                    success: true,
                                    data: {
                                        content: cleanedContent,
                                        message: cleanedContent,
                                        conversationId: conversationId,
                                        messageCount: messageCount,
                                        isStreamComplete: true
                                    }
                                });
                                
                                // 关闭连接
                                socketTask.close();
                            }
                        } else {
                            console.log('⚠️ 收到非DOU_BAO_CHAT类型消息:', data);
                        }
                        
                    } catch (error) {
                        console.error('❌ 解析WebSocket消息失败:', error);
                        console.error('原始消息数据:', event.data);
                        
                        if (payload.onError) {
                            payload.onError(new Error(`消息格式错误: ${error.message}`));
                        }
                        
                        reject(new Error(`消息格式错误: ${error.message}`));
                    }
                });
                
                // 连接错误
                socketTask.onError((error) => {
                    console.error('❌ WebSocket连接错误:', error);
                    if (payload.onError) {
                        payload.onError(new Error('WebSocket连接出现错误'));
                    }
                    reject(new Error('WebSocket连接出现错误'));
                });
                
                // 连接关闭
                socketTask.onClose((event) => {
                    console.log('🔌 WebSocket连接已关闭:', event.code, event.reason);
                    
                    // 如果流式传输未完成但连接关闭，认为传输完成
                    if (!isStreamComplete && streamContent.length > 0) {
                        console.log('⚠️ 连接提前关闭，但已接收到内容，认为传输完成');
                        
                        // 清理最终内容，去除多余空行
                        const cleanedContent = streamContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
                        
                        // 更新AI消息为完成状态
                        if (aiMessageId) {
                            commit('UPDATE_MESSAGE_CONTENT', {
                                messageId: aiMessageId,
                                content: cleanedContent,
                                streaming: false,
                                status: 'sent'
                            });
                        }
                        
                        if (payload.onComplete) {
                            payload.onComplete({
                                content: cleanedContent,
                                conversationId: conversationId,
                                messageCount: messageCount
                            });
                        }
                        
                        resolve({
                            success: true,
                            data: {
                                content: cleanedContent,
                                message: cleanedContent,
                                conversationId: conversationId,
                                messageCount: messageCount,
                                isStreamComplete: true
                            }
                        });
                    } else if (!isStreamComplete) {
                        // 如果没有接收到任何内容且连接关闭，认为是错误
                        const errorMessage = '连接意外关闭，未接收到完整响应';
                        if (payload.onError) {
                            payload.onError(new Error(errorMessage));
                        }
                        reject(new Error(errorMessage));
                    }
                });
            });

            return response;
            
        } catch (error) {
            console.error('❌ sendQuestion执行失败:', error);
            
            // 如果有错误回调，调用它
            if (payload.onError) {
                payload.onError(error);
            }
            
            throw error;
        }
    },

    /**
     * 加载特定对话的完整内容
     * @param {Object} context - Vuex上下文
     * @param {string} conversationId - 对话ID
     * @returns {Promise<Object>} 返回请求结果
     */
    async loadChat({ commit, state }, conversationId) {
        try {
            // 从conversations中找到对应的对话以获取topic信息
            const conversation = state.aiChat.conversations.find(conv => conv.id == conversationId);
            const topic = conversation?.chatMode || 'general';
            
            console.log('=== 强制加载对话详情（无缓存） ===');
            console.log('对话ID:', conversationId);
            console.log('对话模式:', topic);
            console.log('对话信息:', conversation);
            console.log('===================================');
            
            // 强制从后端重新获取数据，添加时间戳防止缓存
            const response = await apiRequest(`${getApiPrefix()}/yanshilu/aiChat/detail`, 'POST', { 
                id: parseInt(conversationId),
                type: "DOU_BAO_CHAT",
                topic: topic,
                timestamp: Date.now() // 添加时间戳防止缓存
            });
            
            console.log('loadChat API响应:', response);
            
            if (response.success) {
                // 修复：正确处理数据层级 - response.data是整个后端响应，需要取response.data.data
                const backendResponse = response.data;
                console.log('后端完整响应:', backendResponse);
                
                // 检查后端响应格式
                if (backendResponse.code !== 200) {
                    throw new Error(backendResponse.msg || '后端返回错误');
                }
                
                // 更新聊天模式
                if (backendResponse.data && backendResponse.data.length > 0 && backendResponse.data[0].topic) {
                    commit('UPDATE_CHAT_MODE', backendResponse.data[0].topic);
                } else if (topic) {
                    commit('UPDATE_CHAT_MODE', topic);
                }
                
                // 获取实际的消息数据数组
                const messageData = backendResponse.data || [];
                console.log('提取的消息数据:', messageData);
                
                // 将question和answer转换为消息格式
                const messages = [];
                
                messageData.forEach((item, index) => {
                    // 添加用户问题消息
                    if (item.question) {
                        messages.push({
                            id: `msg-user-${item.id}-${index}`,
                            role: 'user',
                            content: item.question,
                            timestamp: item.createTime || item.updateTime || new Date().toISOString(),
                            status: 'sent'
                        });
                    }
                    
                    // 添加AI回答消息
                    if (item.answer) {
                        messages.push({
                            id: `msg-ai-${item.id}-${index}`,
                            role: 'AI',
                            content: item.answer,
                            timestamp: item.updateTime || item.createTime || new Date().toISOString(),
                            status: 'sent',
                            streaming: false
                        });
                    }
                });
                
                // 按时间戳排序消息
                messages.sort((a, b) => {
                    const timeA = new Date(a.timestamp).getTime();
                    const timeB = new Date(b.timestamp).getTime();
                    return timeA - timeB;
                });
                
                // 构建完整的对话数据
                const conversationData = {
                    id: conversationId,
                    abstract: conversation?.abstract || '无标题',
                    chatMode: backendResponse.data && backendResponse.data.length > 0 && backendResponse.data[0].topic ? 
                              backendResponse.data[0].topic : topic,
                    type: 'DOU_BAO_CHAT',
                    messages: messages,
                    createdAt: conversation?.createdAt || Date.now(),
                    updatedAt: conversation?.updatedAt || Date.now(),
                    // 添加标记表示这是最新从后端获取的数据
                    lastFetchTime: Date.now()
                };
                
                // 强制更新对话详情到state（覆盖任何现有缓存）
                commit('UPDATE_CONVERSATION_DETAIL', conversationData);
                
                console.log('=== 对话详情强制加载成功 ===');
                console.log('原始数据条数:', messageData.length);
                console.log('转换后消息数:', messages.length);
                console.log('最新获取时间:', new Date(conversationData.lastFetchTime).toLocaleString());
                console.log('对话数据:', conversationData);
                console.log('===============================');
                
                return {
                    success: true,
                    data: conversationData,
                    conversation: conversationData
                };
            } else {
                throw new Error(response.message || '加载对话失败');
            }
        } catch (error) {
            console.error('=== 强制加载对话详情失败 ===');
            console.error('对话ID:', conversationId);
            console.error('错误信息:', error);
            console.error('=============================');
            
            return {
                success: false,
                message: error.message || '加载对话详情失败'
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
            const response = await apiRequest(`${getApiPrefix()}/yanshilu/aiChat/delete`, 'POST', {
                id: conversationId
            });
            
            if (response.success) {
                commit('DELETE_CONVERSATION', conversationId);
                
                // 如果删除的是当前活跃会话，则清空当前活跃会话
                if (state.aiChat.activeConversation === conversationId) {
                    commit('UPDATE_CURRENT_CONVERSATION', null);
                }
                
                return { 
                    success: true,
                    message: '删除成功'
                };
            } else {
                throw new Error(response.message || '删除失败');
            }
        } catch (error) {
            console.error('删除对话失败:', error);
            return {
                success: false,
                message: error.message || '删除对话失败'
            };
        }
    },
    
    /**
     * 获取对话历史列表
     * @param {Object} context - Vuex上下文
     * @param {Object} params - 分页参数
     * @param {number} params.pageNum - 页码
     * @param {number} params.pageSize - 每页大小
     * @description 字段映射关系：
     *   - 后端 title 字段 → 前端 abstract 字段（对话摘要/标题）
     *   - 后端 topic 字段 → 前端 chatMode 字段（对话模式）
     * @returns {Promise<Object>} 返回请求结果
     */
    async loadConversationHistory({ commit, state }, params = {}) {
        try {
            commit('SET_PAGINATION_LOADING', true);
            
            // 使用传入的参数或默认值
            const pageNum = params.pageNum || state.aiChat.pagination.pageNum;
            const pageSize = params.pageSize || state.aiChat.pagination.pageSize;
            
            // 更新页码参数到state（如果有传入）
            if (params.pageNum) commit('SET_PAGE_NUM', params.pageNum);
            if (params.pageSize) commit('SET_PAGE_SIZE', params.pageSize);
            
            // 发送API请求
            const response = await apiRequest(`${getApiPrefix()}/yanshilu/aiChat/list`, 'POST', {
                pageSize,
                pageNum
            });
            console.log('response:', response);
            
            if (response.success && response.data?.code === 200) {
                // 处理返回的数据格式
                const conversationsList = response.data.rows || [];
                console.log('conversationsList:', conversationsList);
                const total = response.data.total || 0;
                
                console.log('=== API响应数据解析 ===');
                console.log('response.success:', response.success);
                console.log('response.data.code:', response.data?.code);
                console.log('response.data.total:', response.data?.total);
                console.log('response.data.rows.length:', response.data?.rows?.length);
                console.log('========================');
                
                // 转换数据格式以适配现有的状态结构
                const formattedConversations = conversationsList.map(item => ({
                    id: item.id,
                    // 处理abstract字段：去除换行符和多余空格
                    abstract: (item.title || '').replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim() || '无标题',
                    chatMode: item.topic || 'general', // 使用topic作为chatMode，默认为general
                    type: item.type,
                    createdAt: item.createTime ? new Date(item.createTime).getTime() : Date.now(),
                    updatedAt: item.updateTime ? new Date(item.updateTime).getTime() : Date.now(),
                    createBy: item.createBy,
                    updateBy: item.updateBy,
                    remark: item.remark
                }));
                
                // 更新对话列表
                commit('UPDATE_CONVERSATIONS_LIST', formattedConversations);
                
                // 计算分页信息
                const totalPages = Math.ceil(total / pageSize);
                const hasNext = pageNum < totalPages;
                const hasPrev = pageNum > 1;
                
                // 更新分页信息
                const paginationInfo = {
                    pageNum,
                    pageSize,
                    total,
                    totalPages,
                    hasNext,
                    hasPrev,
                    loading: false
                };
                
                commit('UPDATE_PAGINATION', paginationInfo);
                
                console.log('=== 对话历史加载成功 ===');
                console.log('原始数据条数:', conversationsList.length);
                console.log('格式化后数据:', formattedConversations);
                console.log('分页信息:', paginationInfo);
                console.log('=======================');
                
                return {
                    success: true,
                    data: formattedConversations,
                    pagination: paginationInfo,
                    total: total
                };
            } else {
                console.error('API响应失败:', response);
                throw new Error(response.message || response.data?.msg || '获取对话历史失败');
            }
        } catch (error) {
            console.error('获取对话历史失败:', error);
            console.error('错误详情:', error.message);
            return {
                success: false,
                message: error.message || '获取对话历史失败'
            };
        } finally {
            commit('SET_PAGINATION_LOADING', false);
        }
    },

    /**
     * 分页相关操作 - 加载下一页
     * @description 字段映射关系：
     *   - 后端 title 字段 → 前端 abstract 字段（对话摘要/标题）
     *   - 后端 topic 字段 → 前端 chatMode 字段（对话模式）
     */
    async nextPage({ state, dispatch, commit }) {
        if (state.aiChat.pagination.hasNext) {
            try {
                const nextPageNum = state.aiChat.pagination.pageNum + 1;
                
                console.log('=== 加载下一页 ===');
                console.log('当前页:', state.aiChat.pagination.pageNum);
                console.log('下一页:', nextPageNum);
                console.log('================');
                
                // 设置加载状态
                commit('SET_PAGINATION_LOADING', true);
                
                // 发送API请求
                const response = await apiRequest(`${getApiPrefix()}/yanshilu/aiChat/list`, 'POST', {
                    pageSize: state.aiChat.pagination.pageSize,
                    pageNum: nextPageNum
                });
                
                if (response.success && response.data?.code === 200) {
                    // 处理返回的数据格式
                    const conversationsList = response.data.rows || [];
                    const total = response.data.total || 0;
                    
                    // 转换数据格式
                    const formattedConversations = conversationsList.map(item => ({
                        id: item.id,
                        // 处理abstract字段：去除换行符和多余空格
                        abstract: (item.title || '').replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim() || '无标题',
                        chatMode: item.topic || 'general',
                        type: item.type,
                        createdAt: item.createTime ? new Date(item.createTime).getTime() : Date.now(),
                        updatedAt: item.updateTime ? new Date(item.updateTime).getTime() : Date.now(),
                        createBy: item.createBy,
                        updateBy: item.updateBy,
                        remark: item.remark
                    }));
                    
                    // 按更新时间倒序排序（最新的在前面）
                    formattedConversations.sort((a, b) => {
                        const timeA = a.updatedAt || a.createdAt || 0;
                        const timeB = b.updatedAt || b.createdAt || 0;
                        return timeB - timeA;
                    });
                    
                    // 追加新数据到现有列表
                    commit('APPEND_CONVERSATIONS_LIST', formattedConversations);
                    
                    // 更新分页信息
                    const totalPages = Math.ceil(total / state.aiChat.pagination.pageSize);
                    const hasNext = nextPageNum < totalPages;
                    const hasPrev = nextPageNum > 1;
                    
                    const paginationInfo = {
                        pageNum: nextPageNum,
                        pageSize: state.aiChat.pagination.pageSize,
                        total,
                        totalPages,
                        hasNext,
                        hasPrev,
                        loading: false
                    };
                    
                    commit('UPDATE_PAGINATION', paginationInfo);
                    
                    console.log('=== 下一页加载成功 ===');
                    console.log('新增数据条数:', formattedConversations.length);
                    console.log('总数据条数:', state.aiChat.conversations.length);
                    console.log('分页信息:', paginationInfo);
                    console.log('====================');
                    
                    return {
                        success: true,
                        data: formattedConversations,
                        pagination: paginationInfo,
                        total: total
                    };
                } else {
                    throw new Error(response.message || '加载下一页失败');
                }
            } catch (error) {
                console.error('加载下一页失败:', error);
                return {
                    success: false,
                    message: error.message || '加载下一页失败'
                };
            } finally {
                commit('SET_PAGINATION_LOADING', false);
            }
        }
        return { success: false, message: '已经是最后一页' };
    },

    async prevPage({ state, dispatch }) {
        if (state.aiChat.pagination.hasPrev) {
            return await dispatch('loadConversationHistory', {
                pageNum: state.aiChat.pagination.pageNum - 1
            });
        }
        return { success: false, message: '已经是第一页' };
    },

    async goToPage({ state, dispatch }, pageNum) {
        if (pageNum >= 1 && pageNum <= state.aiChat.pagination.totalPages) {
            return await dispatch('loadConversationHistory', { pageNum });
        }
        return { success: false, message: '页码超出范围' };
    },

    async changePageSize({ dispatch }, pageSize) {
        return await dispatch('loadConversationHistory', {
            pageNum: 1,
            pageSize
        });
    },

    async refreshPage({ state, dispatch }) {
        return await dispatch('loadConversationHistory', {
            pageNum: state.aiChat.pagination.pageNum,
            pageSize: state.aiChat.pagination.pageSize
        });
    }
};