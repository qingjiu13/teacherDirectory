/**
 * 财务相关API接口
 * @module store/user/APIroute/money_api
 */

import { apiRequest } from '../../JWT.js';

// 需要从API.js导入API URL
const TRANSACTION_GET_TRANSACTION_URL = 'API_URL_HERE'; // 请确保从API.js正确导入

/**
 * 获取指定用户的交易订单列表（分页）
 * @param {string} userId - 用户ID
 * @param {number} page - 当前页码（从1开始）
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TransactionItem[]>}
 */
export const getTransactionAPI = async (userId, page = 1, pageSize = 10) => {
    try {
        if (!userId) {
            throw new Error('userId 不能为空');
        }

        const response = await apiRequest(TRANSACTION_GET_TRANSACTION_URL, 'GET', {
            userId,
            page,
            pageSize
        });

        // 处理返回数据格式
        if (Array.isArray(response.data)) {
            const transactionList = response.data.map(item => ({
                id: String(item.id || ''),
                name: String(item.name || ''),
                date: String(item.date || ''),
                amount: typeof item.amount === 'number'
                    ? item.amount
                    : parseFloat(item.amount) || 0
            }));
            return transactionList;
        } else {
            throw new Error('接口返回格式错误或无数据');
        }
    } catch (error) {
        console.error('获取交易列表失败:', error);
        throw error;
    }
};
