/**
 * ai-chat模块的状态
 * @module store/user/ai-chat/state
 */

export default {
    aiChat: {
        /**
         * 当前活跃的对话ID
         * @type {string|null}
         */
        activeConversation: null,
        
        /**
         * 用户选择的聊天模式
         * @type {string} - 'general'(通用) | 'school'(择校) | 'career'(职业规划)
         */
        chatMode: 'general',
        
        /**
         * 用户个人信息
         * @type {Object}
         */
        userInfo: {
            /**
             * 用户所在学校
             * @type {string}
             */
            school: '',
            
            /**
             * 用户专业
             * @type {string}
             */
            major: ''
        },
        
        /**
         * 对话历史记录
         * @type {Array<Object>}
         */
        conversations: [
            {
                abstract: '摘要',
                id: 'conversation-id',
                chatMode: 'general', // 对话模式，作为标签
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z',
                messages: [
                    {
                        id: 'message-id',
                        content: '消息内容',
                        timestamp: '2023-01-01T00:00:00Z'
                    }
                ]
            }
        ]
    }
}; 