import { getTransactionAPI } from '@/store/user/APIroute/money_api/money_api';

export default {
    /**
     * 初始化加载交易数据（刷新）
     * @param {*} param0 
     * @param {string} userId 
     */
    async fetchTransactionList({ commit, state }, userId) {
        commit('resetTransactionState');
        commit('setLoading', true);
        try {
            const list = await getTransactionAPI(userId, 1, state.pageSize);
            commit('setTransactionList', list);
            commit('setCurrentPage', 1);
            commit('setHasMore', list.length === state.pageSize);
        } catch (err) {
            console.error('获取交易列表失败', err);
            commit('setHasMore', false);
        } finally {
            commit('setLoading', false);
        }
    },

    /**
     * 加载更多交易数据（下拉触发）
     * @param {*} param0 
     * @param {string} userId 
     */
    async loadMoreTransactions({ commit, state }, userId) {
        if (state.isLoading || !state.hasMore) return;

        commit('setLoading', true);
        try {
            const nextPage = state.currentPage + 1;
            const list = await getTransactionAPI(userId, nextPage, state.pageSize);
            commit('appendTransactionList', list);
            commit('setCurrentPage', nextPage);
            if (list.length < state.pageSize) {
                commit('setHasMore', false);
            }
        } catch (err) {
            console.error('加载更多交易记录失败', err);
            commit('setHasMore', false);
        } 
    }
};

