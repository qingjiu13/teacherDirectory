import { BALANCE_GET_BALANCE_URL, BALANCE_WITHDRAWAL_URL } from '../API';

/**
 * 获取用户余额的API
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回请求结果的Promise
 */
export const getBalanceAPI = (userId) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BALANCE_GET_BALANCE_URL,
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
            data: { userId }, // 添加用户ID参数
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            },
            fail: reject
        });
    });
};

/**
 * 提现API
 * @param {Object} data - 提现数据
 * @param {string} data.userId - 用户ID
 * @param {number} data.amount - 提现金额
 * @param {string} data.method - 提现方式
 * @returns {Promise} - 返回请求结果的Promise
 */
export const withdrawAPI = (data) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BALANCE_WITHDRAWAL_URL,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data), // data中应包含userId
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            },
            fail: reject
        });
    });
};
