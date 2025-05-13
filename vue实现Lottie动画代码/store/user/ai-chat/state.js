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
                createdAt: '2025-05-12T10:05:00Z',
                updatedAt: '2025-05-12T10:10:00Z',
                messages: [
                    {
                        id: 'msg-001',
                        role: 'user',
                        content: '我想咨询一下清华大学计算机专业的录取情况',
                        timestamp: '2025-05-12T10:05:00Z'
                    },
                    {
                        id: 'msg-002',
                        role:'AI',
                        content: '清华大学计算机专业去年录取分数线为680分',
                        timestamp: '2025-05-12T10:10:00Z'
                    },
                    {
                        id: 'msg-003',
                        role:'user',
                        content: '我对人工智能领域很感兴趣，该如何规划职业发展？',
                        timestamp: '2025-05-5T14:05:00Z'
                    },
                    {
                        id: 'msg-004',
                        role:'AI',
                        content: '建议先打好数学和编程基础，然后深入学习机器学习算法',
                        timestamp: '2025-05-5T14:15:00Z'
                    }
                ]
            },
            {
                abstract: '职业规划讨论',
                id: 'conv-002',
                chatMode: 'career',
                createdAt: '2025-05-5T14:05:00Z',
                updatedAt: '2025-05-5T14:15:00Z',
                messages: [
                    {
                        id: 'msg-003',
                        role:'user',
                        content: '我对人工智能领域很感兴趣，该如何规划职业发展？',
                        timestamp: '2025-05-5T14:05:00Z'
                    },
                    {
                        id: 'msg-004',
                        role:'AI',
                        content: '建议先打好数学和编程基础，然后深入学习机器学习算法',
                        timestamp: '2025-05-5T14:15:00Z'
                    }
                ]
            },
            {
                abstract: '今日-通用聊天',
                id: 'conv-003',
                chatMode: 'general',
                createdAt: '2025-05-12T13:00:00Z',
                updatedAt: '2025-05-12T13:10:00Z',
                messages: [
                    {
                        id: 'msg-005',
                        role: 'user',
                        content: '今天北京天气怎么样？',
                        timestamp: '2025-05-12T13:00:00Z'
                    },
                    {
                        id: 'msg-006',
                        role: 'AI',
                        content: '今天北京晴，气温22-28℃，适合出行。',
                        timestamp: '2025-05-12T13:10:00Z'
                    }
                ]
            },
            {
                abstract: '今日-择校建议',
                id: 'conv-004',
                chatMode: 'school',
                createdAt: '2025-05-12T14:30:00Z',
                updatedAt: '2025-05-12T14:40:00Z',
                messages: [
                    {
                        id: 'msg-007',
                        role: 'user',
                        content: '上海交通大学和复旦大学计算机专业哪个好？',
                        timestamp: '2025-05-12T14:30:00Z'
                    },
                    {
                        id: 'msg-008',
                        role: 'AI',
                        content: '两所学校计算机专业都很强，交大偏工程，复旦偏理论。',
                        timestamp: '2025-05-12T14:40:00Z'
                    }
                ]
            },
            {
                abstract: '七天内-职业建议',
                id: 'conv-005',
                chatMode: 'career',
                createdAt: '2025-05-10T09:00:00Z',
                updatedAt: '2025-05-10T09:15:00Z',
                messages: [
                    {
                        id: 'msg-009',
                        role: 'user',
                        content: '数据分析师需要哪些技能？',
                        timestamp: '2025-05-10T09:00:00Z'
                    },
                    {
                        id: 'msg-010',
                        role: 'AI',
                        content: '需要掌握统计学、Python、SQL等技能。',
                        timestamp: '2025-05-10T09:15:00Z'
                    }
                ]
            },
            {
                abstract: '七天内-通用问答',
                id: 'conv-006',
                chatMode: 'general',
                createdAt: '2025-05-08T16:20:00Z',
                updatedAt: '2025-05-08T16:25:00Z',
                messages: [
                    {
                        id: 'msg-011',
                        role: 'user',
                        content: '你能推荐几本人工智能入门书籍吗？',
                        timestamp: '2025-05-08T16:20:00Z'
                    },
                    {
                        id: 'msg-012',
                        role: 'AI',
                        content: '推荐《人工智能：一种现代的方法》、《深度学习》',
                        timestamp: '2025-05-08T16:25:00Z'
                    }
                ]
            },
            {
                abstract: '三十天内-择校讨论',
                id: 'conv-007',
                chatMode: 'school',
                createdAt: '2025-04-25T11:00:00Z',
                updatedAt: '2025-04-25T11:10:00Z',
                messages: [
                    {
                        id: 'msg-013',
                        role: 'user',
                        content: '南京大学和东南大学的电子信息专业如何选择？',
                        timestamp: '2025-04-25T11:00:00Z'
                    },
                    {
                        id: 'msg-014',
                        role: 'AI',
                        content: '南京大学学术氛围浓厚，东南大学工程实践强。',
                        timestamp: '2025-04-25T11:10:00Z'
                    }
                ]
            },
            {
                abstract: '三十天内-职业发展',
                id: 'conv-008',
                chatMode: 'career',
                createdAt: '2025-04-20T15:30:00Z',
                updatedAt: '2025-04-20T15:40:00Z',
                messages: [
                    {
                        id: 'msg-015',
                        role: 'user',
                        content: '互联网行业未来五年发展趋势如何？',
                        timestamp: '2025-04-20T15:30:00Z'
                    },
                    {
                        id: 'msg-016',
                        role: 'AI',
                        content: '未来五年互联网行业将更加智能化和多元化。',
                        timestamp: '2025-04-20T15:40:00Z'
                    }
                ]
            }
        ]
    }
};