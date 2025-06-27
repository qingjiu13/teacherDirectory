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
         * 分页相关配置
         * @type {Object}
         */
        pagination: {
            /**
             * 每页显示的对话数量
             * @type {number}
             */
            pageSize: 10,
            
            /**
             * 当前页码（从1开始）
             * @type {number}
             */
            pageNum: 1,
            
            /**
             * 总记录数
             * @type {number}
             */
            total: 0,
            
            /**
             * 总页数
             * @type {number}
             */
            totalPages: 0,
            
            /**
             * 是否有下一页
             * @type {boolean}
             */
            hasNext: false,
            
            /**
             * 是否有上一页
             * @type {boolean}
             */
            hasPrev: false,
            
            /**
             * 是否正在加载
             * @type {boolean}
             */
            loading: false
        },
        
        /**
         * 对话历史记录
         * @type {Array<Object>}
         * @property {string} abstract 对话摘要
         * @property {string} id 对话ID
         * @property {string} chatMode 聊天模式
         * @property {number} createdAt 创建时间（时间戳，毫秒）
         * @property {number} updatedAt 更新时间（时间戳，毫秒）
         * @property {Array<Object>} messages 消息列表
         */
        conversations: [
        ]
    }
};