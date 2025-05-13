/**
 * money模块的状态
 * @module store/user/money/state
 */

/**
 * @typedef {Object} TransactionItem
 * @property {string} id 交易唯一ID
 * @property {string} name 交易名称
 * @property {string} date 交易日期（格式：YYYY-MM-DD HH:mm）
 * @property {number} amount 交易金额，正数为进账，负数为扣款
 */

/**
 * @typedef {Object} TransactionState
 * @property {TransactionItem[]} transactionList 交易订单列表
 */

export default {
    /**
     * 交易订单列表
     * @type {TransactionItem[]}
     */
    transactionList: [
        {
            id: 'tx001',
            name: '学员购买《数学基础》课程',
            // 时间戳格式，单位为毫秒
            /** @type {number} 交易时间的时间戳 */
            date: 1710484200000, // 2024-03-15 14:30:00
            amount: 199.00
        },
        {
            id: 'tx002',
            name: '提现',
            /** @type {number} 交易时间的时间戳 */
            date: 1710033300000, // 2024-03-10 09:15:00
            amount: -50.00
        }
    ],
    currentPage: 1,
    pageSize: 10,
    hasMore: false, // 是否还有更多数据可加载
    isLoading: false
}; 