/**
 * money模块的mutations
 * @module store/user/money/mutations
 */

export default {
    // 设置整页交易数据（首次加载）
    setTransactionList(state, list) {
        state.transactionList = list;
    },
    // 追加更多交易数据（下拉加载）
    appendTransactionList(state, newList) {
        state.transactionList = [...state.transactionList, ...newList];
    },
    // 当前页码更新(用于加载更多数据时候更新数据page页数)
    setCurrentPage(state, page) {
        state.currentPage = page;
    },
    // 是否还有更多数据
    setHasMore(state, status) {
        state.hasMore = status;
    },
    // 重置整个模块状态（如退出登录、刷新等）
    resetTransactionState(state) {
        state.transactionList = [];
        state.currentPage = 1;
        state.hasMore = true;
        state.isLoading = false;
    }
}; 

