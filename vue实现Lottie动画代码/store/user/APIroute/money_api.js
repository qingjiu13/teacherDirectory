/**
 * 获取指定用户的交易订单列表（分页）
 * @param {string} userId - 用户ID
 * @param {number} page - 当前页码（从1开始）
 * @param {number} pageSize - 每页数量
 * @returns {Promise<TransactionItem[]>}
 */
export const getTransactionAPI = (userId, page = 1, pageSize = 10) => {
    return new Promise((resolve, reject) => {
        if (!userId) {
            reject(new Error('userId 不能为空'));
            return;
        }

        uni.request({
            url: TRANSACTION_GET_TRANSACTION_URL,
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                userId,
                page,
                pageSize
            },
            success: (res) => {
                const { statusCode, data } = res;

                if (statusCode === 200 && Array.isArray(data)) {
                    const transactionList = data.map(item => ({
                        id: String(item.id || ''),
                        name: String(item.name || ''),
                        date: String(item.date || ''),
                        amount: typeof item.amount === 'number'
                            ? item.amount
                            : parseFloat(item.amount) || 0
                    }));
                    resolve(transactionList);
                } else {
                    reject(new Error('接口返回格式错误或无数据'));
                }
            },
            fail: reject
        });
    });
};
