/**
 * match模块的mutations
 * @module store/user/match/mutations
 */

export default {
    /**
     * 设置匹配的老师列表
     * @param {Object} state - match模块的state
     * @param {Array} matchList - 老师列表数据
     */
    SET_MATCH_LIST(state, matchList) {
        state.matchList = matchList;
    }
}; 