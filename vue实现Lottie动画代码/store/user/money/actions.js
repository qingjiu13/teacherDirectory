/**
 * money模块的actions
 * @module store/user/money/actions
 */

import { getBalanceAPI, withdrawAPI } from '../APIroute/money_api';

export default {
    /**
     * 获取用户余额
     * @param {Object} context - Vuex的上下文对象
     * @param {Function} context.commit - commit函数
     * @param {Object} context.rootState - 根state对象
     */
    async fetchBalance({ commit, rootState }) {
        try {
            const userId = rootState.user.baseInfo.id; // 从根state获取用户ID
            const res = await getBalanceAPI(userId); // 传递用户ID
            if (res.code === 200) {
                commit('SET_BALANCE', res.data.balance);
            } else {
                throw new Error(res.message || '获取余额失败');
            }
        } catch (err) {
            console.error('fetchBalance error:', err);
            throw err;
        }
    },

    /**
     * 提交提现请求
     * @param {Object} context - Vuex的上下文对象
     * @param {Function} context.commit - commit函数
     * @param {Object} context.state - 当前模块的state
     * @param {Object} context.rootState - 根state对象
     */
    async submitWithdraw({ commit, state, rootState }) {
        try {
            const userId = rootState.user.baseInfo.id; // 从根state获取用户ID
            const payload = {
                userId, // 添加用户ID
                amount: state.withdrawAmount,
                method: state.withdrawMethod
            };
            const res = await withdrawAPI(payload);
            if (res.code === 200) {
                // 后端返回新的余额
                commit('SET_BALANCE', res.data.newBalance);
                return res;
            } else {
                throw new Error(res.message || '提现失败');
            }
        } catch (err) {
            console.error('submitWithdraw error:', err);
            throw err;
        }
    }
}; 