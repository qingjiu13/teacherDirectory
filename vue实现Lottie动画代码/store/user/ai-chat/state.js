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
                abstract: '关于择校的咨询',
                id: 'conv-001',
                chatMode: 'school',
                createdAt: '2023-10-01T10:00:00Z',
                updatedAt: '2023-10-01T10:30:00Z',
                messages: [
                    {
                        id: 'msg-001',
                        content: '我想咨询一下清华大学计算机专业的录取情况',
                        timestamp: '2023-10-01T10:05:00Z'
                    },
                    {
                        id: 'msg-002',
                        content: '清华大学计算机专业去年录取分数线为680分',
                        timestamp: '2023-10-01T10:10:00Z'
                    }
                ]
            },
            {
                abstract: '职业规划讨论',
                id: 'conv-002',
                chatMode: 'career',
                createdAt: '2023-10-02T14:00:00Z',
                updatedAt: '2023-10-02T14:45:00Z',
                messages: [
                    {
                        id: 'msg-003',
                        content: '我对人工智能领域很感兴趣，该如何规划职业发展？',
                        timestamp: '2023-10-02T14:05:00Z'
                    },
                    {
                        id: 'msg-004',
                        content: '建议先打好数学和编程基础，然后深入学习机器学习算法',
                        timestamp: '2023-10-02T14:15:00Z'
                    }
                ]
            }
        ]
    }
};